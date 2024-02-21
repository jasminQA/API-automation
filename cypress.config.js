const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'rhi3x6',
  video: true,
  viewportHeight: 1080,
  viewportWidth:1920,
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  env:{
    username:'jasmin@test.com',
    password:'password',
    apiUrl:'https://conduit-api.bondaracademy.com/api'
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://conduit.bondaracademy.com/',
    specPattern:'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}'
  },
});
