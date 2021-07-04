/// <reference types="Cypress" />

/// JSON fixture file can be loaded directly using
// the built-in JavaScript bundler
const TESTDATA = require('../fixtures/' + Cypress.env('fixtureFile') + '')

//  Imports of PageObjects
import PageLogin from '../pageobjects/PageLogin'
import PageHeader from '../pageobjects/PageHeader'
import PageHome from '../pageobjects/PageHome'


// Objects Initiazation
const ObjectLogin = new PageLogin();
const ObjectHeader = new PageHeader();
const ObjectHome = new PageHome();


// TestCases
describe('User-Login', function () {

  beforeEach(function () {

    cy.log('' + Cypress.env('baseUrlapi'))
    // Open The URL AND Verify Home Page
    cy.log("Open the URL")
    cy.visit('/')
    cy.get(ObjectHome.slickSlider, { log: false }).should('be.visible')
  })


  afterEach(function () {
    if (this.currentTest.state === 'passed') {
      cy.passTest(this.currentTest.testcaseId)
    }
    if (this.currentTest.state === 'failed') {
      cy.failTest(this.currentTest.testcaseId)
      cy.sendSlackNotification(this.currentTest.title, this.currentTest.err.stack)
      // Cypress.runner.stop()
    }
  })

  // Positive Scenario

  it('C2008 Verify that user is able to login with existing email', function () {

    this.test.testcaseId = 2008
    //Automation
    const log = Cypress.log({

      name: "login",
      displayName: "LOGIN",
      message: [`Authorizing | ${TESTDATA.validLoginCredentials.email}`],
      autoEnd: 'false',

    })
    cy.log("Click on Login link")
    cy.xpath(ObjectHeader.linkLogin, { log: false }).click()
    cy.log("Type Email in Email textbox")
    cy.get(ObjectLogin.textEmail).type(TESTDATA.validLoginCredentials.email)
    cy.log("Type Password in Password textbox")
    cy.get(ObjectLogin.textPassword).type(Cypress.env('adminPassword'), { log: false })
    cy.log("Click on Submit button")
    cy.get(ObjectLogin.buttonLogin).click()

    //Validate
    cy.log("Verify redirect to today page")
    cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateMenu);
    cy.screenshot()

  })
  // Negative Scenario

  it('C50220  Verify that user is not able to signin with invalid email/Password', function () {
    this.test.testcaseId = 50220
    //Automation
    cy.log("Click on Login link")
    cy.xpath(ObjectHeader.linkLogin).click()
    cy.log("Type Email in Email textbox")
    cy.get(ObjectLogin.textEmail).type(TESTDATA.invalidLoginCredentials.wrongEmail)
    cy.log("Type Password in Password textbox")
    cy.get(ObjectLogin.textPassword).type(Cypress.env('adminPassword'), { log: false })
    cy.log("Click on Submit button")
    cy.get(ObjectLogin.buttonLogin).click()

    //Validate
    cy.log("Error Message Displayed")
    cy.get(ObjectLogin.errorMsg).should('be.visible')
    cy.get(ObjectLogin.errorMsg).should('have.text', TESTDATA.toasterAssertions.errorMessage)

  })

  it('C52005 Verify that the user gets error messages when signing in with no email/password', function () {

    this.test.testcaseId = 52005
    cy.log("Click on Login Link")
    cy.xpath(ObjectHeader.linkLogin).click();
    cy.get(ObjectLogin.textEmail).should('be.visible');
    cy.wait(2000)
    cy.log("Clicking on Login Button")
    cy.get(ObjectLogin.buttonLogin).click({ force: true });

    //Validate Error Messages 
    cy.get(ObjectLogin.errorMsg).eq(0).should('be.visible');
    cy.get(ObjectLogin.errorMsg).eq(1).should('be.visible');
    //Email Field Error Message
    cy.get(ObjectLogin.errorMsg).eq(0).should('have.text', TESTDATA.toasterAssertions.verifyMissingEmailErrorMessage)
    //Password Field Error Message
    cy.get(ObjectLogin.errorMsg).eq(1).should('have.text', TESTDATA.toasterAssertions.verifyMissingPasswordErrorMessage)



  })
})