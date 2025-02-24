import type { Config } from "jest";

const config: Config = {
    preset: "jest-puppeteer",
    reporters: [
        "default",
        [
            "<rootDir>/../node_modules/jest-html-reporters",
            {
                expand: false,
                filename: "Full-Run-Result.html",
                openReport: false,
                pageTitle: "Full Test Report",
                publicPath: "<rootDir>/reports"
            }
        ]
    ],
    resetMocks: true,
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testEnvironment: "jest-environment-puppeteer",
    testEnvironmentOptions: {},
    testMatch: ["<rootDir>/tests/**/*.test.ts"],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    verbose: false
};

export default config;
