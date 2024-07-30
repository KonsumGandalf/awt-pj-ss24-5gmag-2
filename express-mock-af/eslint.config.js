const globals = require('globals');
const js = require('@eslint/js');

module.exports = [
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
    {
        ignores: [
            "coverage/*",
            "dist/*",
            "node_modules/*",
        ]
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
