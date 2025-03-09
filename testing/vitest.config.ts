import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        include: ["testing/tests/**/*.test.ts"],
        reporters: [
            "verbose",
            ["html", { outputFile: "testing/reports/vitest-report.html" }],
            ["junit", { outputFile: "testing/reports/vitest-report.xml" }],
            ["json", { outputFile: "testing/reports/vitest-report.json" }],
            ...(process.env.GITHUB_ACTIONS ? ["github-actions"] : [])
        ],
        slowTestThreshold: 0
    }
});
