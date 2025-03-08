import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        include: ["testing/tests/**/*.test.ts"],
        reporters: ["default", ["html", { outputFile: "testing/reports/vitest-report.html" }]]
    }
});
