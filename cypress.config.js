const { defineConfig } = require("cypress");
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) { },
    specPattern: "cypress/integration/**/*.spec.js",
    video: true,
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 60000,
    requestTimeout: 5000,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
  },
  env: {
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    googleClientId: process.env.REACT_APP_GOOGLE_CLIENTID,
    googleClientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
    GOOGLE_EMAIL: process.env.GOOGLE_EMAIL,
    GOOGLE_PASSWORD: process.env.GOOGLE_PASSWORD
  },
  e2e: {
    experimentalModifyObstructiveThirdPartyCode: true,
  },
});
