class CustomLogger {
    constructor() {
        this.chalk = null;
        this.loggingQueue = Promise.resolve();
    }

    /**
     * Imports chalk only if it hasn't been imported already.
     */
    async initialiseChalk() {
        if (!this.chalk) {
            this.chalk = (await import("chalk")).default;
        }
    }

    /**
     * Logs a message to the console.
     * Ensures that logs are printed in the order they are called by chaining them in a queue.
     */
    async log(message) {
        return (this.loggingQueue = this.loggingQueue.then(() => {
            console.log(message);
        }));
    }

    async onTestCaseStart(test, testCase) {
        await this.initialiseChalk(); // Check chalk is imported before logging starts
        await this.log(`${this.chalk.yellow("Running:")} ${testCase.fullName}`);
    }

    async onTestCaseResult(test, testCaseResult) {
        await this.initialiseChalk(); // Check chalk is imported before logging starts
        if (testCaseResult.status.toLowerCase() === "passed") {
            await this.testPassed(test, testCaseResult);
        } else {
            await this.testFailed(test, testCaseResult);
        }
    }

    async testPassed(test, testCaseResult) {
        const testDuration = this.chalk.blue(testCaseResult.duration + "ms");
        await this.log(`${this.chalk.green("Passed")} after ${testDuration}`);
    }

    async testFailed(test, testCaseResult) {
        const testDuration = this.chalk.blue(testCaseResult.duration + "ms");
        await this.log(`${this.chalk.red("Failed")} after ${testDuration}`);

        const errorMessage = testCaseResult.failureMessages.join("\n");
        await this.log(`${this.chalk.red("Error")} ${errorMessage}`);
    }
}

module.exports = CustomLogger;
