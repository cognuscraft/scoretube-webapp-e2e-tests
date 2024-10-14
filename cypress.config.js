const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {},
    specPattern: "cypress/integration/**/*.spec.js",
    video: true,
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 60000,
    requestTimeout: 5000,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
  },
});
