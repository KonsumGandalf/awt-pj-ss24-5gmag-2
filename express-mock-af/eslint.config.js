import globals from 'globals';
import js from '@eslint/js';

export default [
    {
        files: ['**/*.js', '**/*.jsx']
    },
    {
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    },
    js.configs.recommended,
    {
        rules: {
            'no-shadow': 'off',
            'no-plusplus': 'off',
            'no-console': 'off',
            'consistent-return': 'off',
            'no-undef': 'off',
            'no-unused-vars': 'off',
        }
    },
    {
        files: ['**/*.spec.js', '**/*.spec.jsx'],

        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },
];