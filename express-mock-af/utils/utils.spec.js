const fs = require('fs');
const path = require('path');
const dir = require('node-dir');
const Utils = require('./utils');

jest.mock('fs');
jest.mock('node-dir');
jest.mock('@faker-js/faker', () => ({
    faker: {
        number: {
            int: jest.fn().mockReturnValue(1500),
        },
    },
}));

describe('utils', () => {
    describe('writeToDisk', () => {
        it('should write content to disk and notify subscribers', async () => {
            const filepath = 'test/path/file.txt';
            const content = 'test content';
            const topic = 'testTopic';

            fs.writeFile.mockImplementation((path, data, callback) => callback(null));
            fs.mkdirSync.mockImplementation(() => {});

            const observer = jest.fn();
            Utils.fileWritten$.subscribe(observer);

            await Utils.writeToDisk(filepath, content, topic);

            expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(filepath), { recursive: true });
            expect(fs.writeFile).toHaveBeenCalledWith(filepath, content, expect.any(Function));
            expect(observer).toHaveBeenCalledWith({ content, topic });
        });

        it('should reject if there is an error writing to disk', async () => {
            const filepath = 'test/path/file.txt';
            const content = 'test content';
            const topic = 'testTopic';

            const error = new Error('Write error');
            fs.writeFile.mockImplementation((path, data, callback) => callback(error));

            await expect(Utils.writeToDisk(filepath, content, topic)).rejects.toThrow('Write error');
        });
    });

    describe('readFiles', () => {
        it('should read files from directory and return their content', async () => {
            const directoryPathRoot = 'test/path';
            const fileMatchRegex = /\.txt$/;
            const fileContents = ['content1', 'content2'];

            dir.readFiles.mockImplementation((path, options, fileCallback, endCallback) => {
                fileCallback(null, fileContents[0], () => {});
                fileCallback(null, fileContents[1], () => {});
                endCallback(null, ['file1.txt', 'file2.txt']);
            });

            fs.readFileSync.mockImplementation((filePath) => (filePath === 'file1.txt' ? 'content1' : 'content2'));

            const result = await Utils.readFiles(directoryPathRoot, fileMatchRegex);

            expect(result).toEqual(fileContents);
        });

        it('should handle errors when reading files from directory', async () => {
            const directoryPathRoot = 'test/path';
            const fileMatchRegex = /\.txt$/;
            const error = new Error('Read error');

            dir.readFiles.mockImplementation((path, options, fileCallback, endCallback) => {
                endCallback(error);
            });

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await Utils.readFiles(directoryPathRoot, fileMatchRegex);

            expect(result).toEqual([]);
            expect(consoleSpy).toHaveBeenCalledWith(`Error reading files from ${directoryPathRoot}: ${error.message}`);
        });
    });

    describe('getDirectoriesRecursive', () => {
        it('should return file paths matching the regex', async () => {
            const directoryPath = 'test/path';
            const fileMatchRegex = /\.txt$/;
            const files = ['file1.txt', 'file2.txt'];

            dir.readFiles.mockImplementation((path, options, fileCallback, endCallback) => {
                endCallback(null, files);
            });

            const result = await Utils.getDirectoriesRecursive(directoryPath, fileMatchRegex);

            expect(result).toEqual(files);
        });

        it('should reject if there is an error reading files', async () => {
            const directoryPath = 'test/path';
            const fileMatchRegex = /\.txt$/;
            const error = new Error('Read error');

            dir.readFiles.mockImplementation((path, options, fileCallback, endCallback) => {
                endCallback(error);
            });

            await expect(Utils.getDirectoriesRecursive(directoryPath, fileMatchRegex)).rejects.toThrow('Read error');
        });
    });

    describe('regexRangeToArray', () => {
        it('should convert a regex range string to an array', () => {
            const rangeString = '1-5';
            const result = Utils.regexRangeToArray(rangeString);
            expect(result).toEqual(['1', '2', '3', '4', '5']);
        });

        it('should return an empty array if the range string does not match the pattern', () => {
            const rangeString = 'invalid';
            const result = Utils.regexRangeToArray(rangeString);
            expect(result).toEqual([]);
        });
    });

    describe('triggerIrregularInterval', () => {
        jest.useFakeTimers();

        it('should trigger an event at irregular intervals', () => {
            const topic = 'testTopic';
            const content = 'testContent';
            const minDelay = 1000;
            const maxDelay = 2000;

            const observer = jest.fn();
            Utils.fileWritten$.subscribe(observer);

            Utils.triggerIrregularInterval(topic, content, minDelay, maxDelay);

            jest.advanceTimersByTime(1500);

            expect(observer).toHaveBeenCalledWith({ topic, content });

            jest.clearAllTimers();
        });
    });
});
