/**
 * Jest configuration for TypeScript tests
 */

module.exports = {
  roots: ["<rootDir>/gatsby"],
  testMatch: ["**/__tests__/**/*.test.{ts,tsx,js,jsx}"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "gatsby/**/*.{ts,tsx}",
    "!gatsby/**/*.d.ts",
    "!gatsby/**/__tests__/**",
  ],
};
