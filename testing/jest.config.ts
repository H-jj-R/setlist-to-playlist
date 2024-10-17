import type { Config } from "jest";
import { defaults } from "jest-config";

const config: Config = {
    verbose: false,
    preset: "jest-puppeteer",
    testEnvironment: "jest-environment-puppeteer",
    resetMocks: true,
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testMatch: ["<rootDir>/tests/**/*.test.ts"],
    testEnvironmentOptions: {},
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    reporters: [
        "default",
        "<rootDir>/logger.js",
        [
            "<rootDir>/../node_modules/jest-html-reporters",
            {
                pageTitle: "Full Test Report",
                publicPath: "<rootDir>/reports",
                filename: "Full-Run-Result.html",
                openReport: false,
                expand: false
            }
        ]
    ]
};

export default config;
