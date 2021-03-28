const path = require('path');

module.exports = {
    transform: {
        '^.+\\.[jt]sx?$': 'esbuild-jest',
    },
    transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!lodash-es)"
    ],
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json'
    ],
};