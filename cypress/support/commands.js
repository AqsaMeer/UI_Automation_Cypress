// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
const TESTDATA = require('../fixtures/' + Cypress.env('fixtureFile') + '')
import 'cypress-wait-until'



//A custom api command to get the accesstoken for further api calls
Cypress.Commands.add('accessToken', (username, passwrod) => {
    cy.request({
        method: 'POST',
        url: '' + Cypress.env('baseUrlapi') + '/api/login',
        headers: { "Content-Type": "application/json;charset=UTF-8", "Origin": "" + Cypress.config().baseUrl + "" },
        body: { grant_type: "password", client_id: "2", client_secret: "itisclientsecretkey", username: "" + username + "", password: "" + passwrod + "", scope: "*" }

    })
        .its('body')
        .then((body) => {
            //var mycookie = JSON.stringify(body.body.userToken);
            cy.writeFile('data_files/accessToken.txt', body.body.userToken.access_token)

        })
})
//A custom LoginApi Command required 2 Arguments  Username and Password
Cypress.Commands.add('loginApi', (username, password) => {

    cy.request({
        method: 'POST',
        url: '' + Cypress.env('baseUrlapi') + '/api/login',
        headers: { "Content-Type": "application/json;charset=UTF-8", "Origin": "" + Cypress.config().baseUrl + "" },
        body: { grant_type: "password", client_id: "2", client_secret: "e1rqOsCidj7bZpQ3mWhIps3jYSBo6qj8YW56J2aY", username: "" + username + "", password: "" + password + "", scope: "*" }

    })

        .its('body')
        .then((body) => {
            let myCookie = JSON.stringify(body.body.userToken);
            cy.writeFile('data_files/token.txt', myCookie)

        })
})


// support/commands.js
const COMMAND_DELAY = 700;


for (const command of ['visit', 'click', 'trigger', 'type', 'clear', 'reload', 'contains']) {
    Cypress.Commands.overwrite(command, (originalFn, ...args) => {
        const origVal = originalFn(...args);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(origVal);
            }, COMMAND_DELAY);
        });
    });
}
