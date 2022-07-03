module.exports = {
  rootDir: "../..",
  preset: "ts-jest",
  verbose: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/hooks/*.{ts,tsx}",
    "!<rootDir>/node_modules/",
    "!**/node_modules/**",
    "!**/dist/**",
  ],
  coverageDirectory: "__tests__/coverage",
  coverageProvider: "v8",
  coverageReporters: ["text-summary", "lcov"],

  setupFiles: [],

  setupFilesAfterEnv: ["<rootDir>/__tests__/conf/setupTests.ts"],

  testMatch: ["**/*.spec.ts", "**/*.spec.tsx"],
  moduleNameMapper: {
    "^src/(.*)": "<rootDir>/src/$1",
  },

  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$":
      "<rootDir>/node_modules/react-scripts/config/jest/babelTransform.js",
    "^.+\\.css$":
      "<rootDir>/node_modules/react-scripts/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)":
      "<rootDir>/node_modules/react-scripts/config/jest/fileTransform.js",
  },
};
