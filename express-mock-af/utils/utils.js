const fs = require('fs');
const path = require('path');
const dir = require('node-dir');
const { chain, isEmpty } = require('lodash');
const { BehaviorSubject } = require('rxjs');
const { faker } = require('@faker-js/faker');

class Utils {
    static fileWritten$ = new BehaviorSubject({});

    static async writeToDisk(filepath, content, topic) {
        return new Promise((resolve, reject) => {
            fs.mkdirSync(path.dirname(filepath), { recursive: true });
            fs.writeFile(filepath, content, (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.fileWritten$.next({ content, topic });
                    resolve();
                }
            });
        });
    }

    /**
     * Read files from directory paths and return the content of the files in utf-8 format.
     *
     * @param directoryPathRoot
     * @param fileMatchRegex
     * @returns {Promise<*|*[]>}
     */
    static async readFiles(directoryPathRoot, fileMatchRegex) {
        try {
            const filePaths = await Utils.getDirectoriesRecursive(directoryPathRoot, fileMatchRegex);
            return chain(filePaths)
                .map((path) => {
                    const fileContent = fs.readFileSync(path, 'utf-8');
                    return fileContent || null;
                })
                .filter((content) => !isEmpty(content))
                .value();
        } catch (error) {
            console.error(`Error reading files from ${directoryPathRoot}: ${error.message}`);
            return [];
        }
    }

    /**
     * Search for files in the given directory recursively.
     *
     * @param path
     * @returns {Promise<unknown>}
     */
    static async getDirectoriesRecursive(path, fileMatchRegex) {
        return new Promise((resolve, reject) => {
            dir.readFiles(
                path,
                {
                    match: fileMatchRegex,
                },
                (err, content, next) => {
                    if (err) return reject(err);
                    next();
                },
                (err, files) => {
                    if (err) return reject(err);
                    resolve(files);
                }
            );
        });
    }

    /**
     * Logically converts a regular expression range string to an array.
     * @param rangeString
     * @returns {*|*[]}
     */
    static regexRangeToArray(rangeString) {
        const match = rangeString.match(/(\d+)-(\d+)/);
        if (!match) return [];

        const start = parseInt(match[1], 10);
        const end = parseInt(match[2], 10);

        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i.toString());
        }
        return result;
    }

    static triggerIrregularInterval(topic, content, minDelay, maxDelay) {
        const delay = faker.number.int({ min: minDelay, max: maxDelay });
        setTimeout(() => {
            this.fileWritten$.next({ topic, content });
            this.triggerIrregularInterval(topic, content, minDelay, maxDelay);
        }, delay);
    }
}

module.exports = Utils;
