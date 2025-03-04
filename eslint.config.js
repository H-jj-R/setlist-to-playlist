const nextPlugin = require("@next/eslint-plugin-next");
const tsParser = require("@typescript-eslint/parser");
const perfectionist = require("eslint-plugin-perfectionist");

// Run with: npx eslint .
module.exports = [
    {
        files: ["**/*.tsx", "**/*.ts", "**/*.jsx", "**/*.js", "**/*.json"],
        ignores: [".next/**", "node_modules/**", "testing/reports/**", "package-lock.json", "package.json"],
        languageOptions: { parser: tsParser },
        plugins: {
            "@next/next": nextPlugin, // Documentation: https://nextjs.org/docs/app/api-reference/config/eslint
            perfectionist // Documentation: https://perfectionist.dev/
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            "perfectionist/sort-array-includes": [
                "error",
                {
                    customGroups: [],
                    groupKind: "literals-first",
                    groups: [],
                    ignoreCase: true,
                    newlinesBetween: "ignore",
                    order: "asc",
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical",
                    useConfigurationIf: {}
                }
            ],
            "perfectionist/sort-enums": [
                "error",
                {
                    customGroups: [],
                    forceNumericSort: false,
                    groups: [],
                    ignoreCase: true,
                    newlinesBetween: "ignore",
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    sortByValue: false,
                    specialCharacters: "keep",
                    type: "alphabetical"
                }
            ],
            "perfectionist/sort-exports": [
                "error",
                {
                    groupKind: "mixed",
                    ignoreCase: true,
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical"
                }
            ],
            "perfectionist/sort-imports": [
                "error",
                {
                    customGroups: { type: {}, value: {} },
                    environment: "node",
                    groups: [
                        "type",
                        ["builtin", "external"],
                        "internal-type",
                        "internal",
                        ["parent-type", "sibling-type", "index-type"],
                        ["parent", "sibling", "index"],
                        "object",
                        "unknown"
                    ],
                    ignoreCase: true,
                    internalPattern: ["^~/.+"],
                    maxLineLength: undefined,
                    newlinesBetween: "always",
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical"
                }
            ],
            "perfectionist/sort-interfaces": [
                "error",
                {
                    customGroups: [],
                    groupKind: "mixed",
                    groups: [],
                    ignoreCase: true,
                    ignorePattern: [],
                    newlinesBetween: "ignore",
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical"
                }
            ],
            "perfectionist/sort-jsx-props": [
                "error",
                {
                    customGroups: {
                        className: "^className$",
                        id: "^id$"
                    },
                    groups: ["id", "className", "unknown"],
                    ignoreCase: true,
                    ignorePattern: [],
                    newlinesBetween: "ignore",
                    order: "asc",
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical"
                }
            ],
            "perfectionist/sort-maps": [
                "error",
                {
                    customGroups: [],
                    groups: [],
                    ignoreCase: true,
                    newlinesBetween: "ignore",
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical",
                    useConfigurationIf: {}
                }
            ],
            "perfectionist/sort-named-exports": [
                "error",
                {
                    groupKind: "mixed",
                    ignoreAlias: false,
                    ignoreCase: true,
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical"
                }
            ],
            "perfectionist/sort-named-imports": [
                "error",
                {
                    groupKind: "mixed",
                    ignoreAlias: false,
                    ignoreCase: true,
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical"
                }
            ],
            "perfectionist/sort-object-types": [
                "error",
                {
                    customGroups: [],
                    groups: [],
                    ignoreCase: true,
                    ignorePattern: [],
                    newlinesBetween: "ignore",
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical"
                }
            ],
            "perfectionist/sort-objects": [
                "error",
                {
                    customGroups: [],
                    destructuredObjects: true,
                    groups: [],
                    ignoreCase: true,
                    ignorePattern: [],
                    newlinesBetween: "ignore",
                    objectDeclarations: true,
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    styledComponents: true,
                    type: "alphabetical",
                    useConfigurationIf: {}
                }
            ],
            "perfectionist/sort-sets": [
                "error",
                {
                    customGroups: [],
                    groupKind: "literals-first",
                    groups: [],
                    ignoreCase: true,
                    newlinesBetween: "ignore",
                    order: "asc",
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical",
                    useConfigurationIf: {}
                }
            ],
            "perfectionist/sort-switch-case": [
                "error",
                {
                    ignoreCase: true,
                    order: "asc",
                    specialCharacters: "keep",
                    type: "alphabetical"
                }
            ],
            "perfectionist/sort-union-types": [
                "error",
                {
                    groups: [],
                    ignoreCase: true,
                    newlinesBetween: "ignore",
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical"
                }
            ],
            "perfectionist/sort-variable-declarations": [
                "error",
                {
                    ignoreCase: true,
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical"
                }
            ]
        }
    }
];
