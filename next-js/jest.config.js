const nextJest = require('next/jest')
 
/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['./jest.setup.ts'],
  "coverageReporters": ["lcov", ["text", { "file": "coverage.txt", "path": "./" }]],
  testTimeout: 30000, // Aumenta il timeout a 30 secondi
  maxWorkers: 2, // Limita il numero di worker a 2
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config)