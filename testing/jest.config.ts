import type { Config } from "jest";

const config: Config = {
    preset: "jest-puppeteer", // Use jest-puppeteer package for integrating the two frameworks together
    reporters: [
        "default", // Default Jest reporter to log results to console
        [
            "<rootDir>/../node_modules/jest-html-reporters", // HTML reporter for test results
            {
                expand: false, // Collapse test details in the report by default
                filename: "Full-Run-Result.html", // Name of the generated report file
                openReport: false, // Prevents automatically opening the report after tests
                pageTitle: "Full Test Report", // Title of the HTML report page
                publicPath: "<rootDir>/reports" // Directory where the report will be saved
            }
        ]
    ],
    resetMocks: true, // Reset mocks before each test to ensure a clean state
    testEnvironment: "jest-environment-puppeteer", // Use Puppeteer test environment for browser testing
    testMatch: ["<rootDir>/tests/**/*.test.ts"], // Match all test files inside the "tests" folder with .test.ts extension
    transform: { "^.+\\.tsx?$": "ts-jest" }, // Use ts-jest to transpile TypeScript files as Jest doesn't natively support TypeScript
    verbose: false // More detailed console output
};

export default config;
