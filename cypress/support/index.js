// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './slack-webhook'
import 'cypress-mochawesome-reporter/register';



// //Testing
// module.exports = (on, config) => {
//     /** the rest of your plugins... **/
//     require('cypress-log-to-output').install(on)
//     // or, if there is already a before:browser:launch handler, use .browserLaunchHandler inside of it
//     // @see https://github.com/flotwig/cypress-log-to-output/issues/5
// }



// Alternatively you can use CommonJS syntax:
// require('./commands')

require('cypress-xpath')

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})
