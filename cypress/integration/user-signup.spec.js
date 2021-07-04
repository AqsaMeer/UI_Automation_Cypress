/// <reference types="Cypress" />

/// JSON fixture file can be loaded directly using
// the built-in JavaScript bundler
const TESTDATA = require('../fixtures/' + Cypress.env('fixtureFile') + '')

//  Imports of PageObjects
import PageLogin from '../pageobjects/PageLogin'
import PageMenu from '../pageobjects/PageMenu'
import PageHeader from '../pageobjects/PageHeader'
import PageHome from '../pageobjects/PageHome'
import PageSignup from '../pageobjects/PageSignup'
import PageApiEndPoints from '../pageobjects/PageApiEndPoints'
import Faker from 'faker'


// Objects Initiazatio
const ObjectLogin = new PageLogin()
const ObjectMenu = new PageMenu()
const ObjectHeader = new PageHeader()
const ObjectHome = new PageHome()
const ObjectSignup = new PageSignup()
const ObjectApiEndPoint = new PageApiEndPoints()


// Variable Declaration
let firstName = ''
let lastName = ''
let email = ''

describe('User Sign Up', function () {

    beforeEach(function () {
        // Open The URL And Verify Home Page
        cy.log("Open the URL")
        cy.visit('/')
        cy.get(ObjectHome.slickSlider).should('be.visible')
        cy.log("Click on the SignUp button")
        cy.xpath(ObjectHeader.linkSignup).click({ force: true })
        //Assert redirect to Location page
        cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateLocation)

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

    });

    it('C50221 Verify That The User is Able To Signup With Email Using Active Company.', function () {
        this.test.testcaseId = 50221

        //Automation
        cy.log("Assert Company Search page has been loaded")
        // cy.wait(2000)
        cy.waitFor(ObjectSignup.textCompanySearch)
        cy.log("Input Company's Name in the search field:" + TESTDATA.signup.companyName)
        cy.get(ObjectSignup.textCompanySearch).type(TESTDATA.signup.companyName)

        //Invoke Server to fetch all network XHR requests
        cy.intercept("GET", '' + Cypress.env('baseUrlapi') + ObjectApiEndPoint.apiLocationQuery + TESTDATA.signup.companyName + '').as('verifiedCompanies')
        cy.wait('@verifiedCompanies').its('response.statusCode').should('eq', 200)
        // cy.wait(2000)
        cy.waitFor(ObjectSignup.listSelectCompany)
        cy.log("Select the Existing Company from the drop down")
        cy.get(ObjectSignup.listSelectCompany).click()
        cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateProfile)


        firstName = Faker.name.firstName()
        lastName = Faker.name.lastName()
        email = "auto" + Faker.random.uuid() + "@yopmail.net"
        // Sign up button click & Input Data
        cy.log("Select Email signup button")
        cy.log("Input Email address")
        cy.get(ObjectSignup.buttonSignupEmail).click()
        cy.log("Input First name")
        cy.get(ObjectSignup.textFname).type(firstName)
        cy.log("Input last name")
        cy.get(ObjectSignup.textLname).type(lastName)
        cy.log("Input Email " + email)
        cy.get(ObjectSignup.textEmail).type(email)
        cy.log("Input Password")
        cy.get(ObjectSignup.textPassword).type(TESTDATA.signup.password)
        cy.log("Submit form")
        cy.get(ObjectSignup.buttonSubmit).click()

        //Assert redirect to mobile number page
        cy.log("Assert that mobile number page has been loaded")
        cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateMobile)
        cy.mobileVerification(email)

        //Validate
        cy.generalConfigCutoffTime()
        cy.log("Verify redirect to today page")
        cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateMenu)
        cy.log("Take screenshot")
        // cy.screenshot()


    })


    it('C2011 Verify That The User is Able To Signup With Email Using Inactive Company.', function () {
        this.test.testcaseId = 2011

        //Automation
        cy.log("Assert Company Search page has been loaded")
        // cy.wait(2000)
        cy.waitFor(ObjectSignup.textCompanySearch)
        cy.log("Input Company's Name in the search field:" + TESTDATA.signup.inactiveCompany)
        cy.get(ObjectSignup.textCompanySearch).type(TESTDATA.signup.inactiveCompany)

        //Invoke Server to fetch all network XHR requests
        // cy.server()
        cy.intercept("GET", '' + Cypress.env('baseUrlapi') + ObjectApiEndPoint.apiLocationQuery + TESTDATA.signup.inactiveCompany + '').as('verifiedCompanies')
        cy.wait('@verifiedCompanies').its('response.statusCode').should('eq', 200)
        cy.waitFor(ObjectSignup.listSelectCompany)
        cy.log("Select the Existing Company from the drop down")
        cy.get(ObjectSignup.listSelectCompany).click()
        cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateProfile)


        firstName = Faker.name.firstName()
        lastName = Faker.name.lastName()
        email = "auto" + Faker.random.uuid() + "@yopmail.net"
        // Sign up button click & Input Data
        cy.log("Select Email signup button")
        cy.log("Input Email address")
        cy.get(ObjectSignup.buttonSignupEmail).click()
        cy.log("Input First name")
        cy.get(ObjectSignup.textFname).type(firstName)
        cy.log("Input last name")
        cy.get(ObjectSignup.textLname).type(lastName)
        cy.log("Input Email " + email)
        cy.get(ObjectSignup.textEmail).type(email)
        cy.log("Input Password")
        cy.get(ObjectSignup.textPassword).type(TESTDATA.signup.password)
        cy.log("Submit form")
        cy.get(ObjectSignup.buttonSubmit).click()

        //Assert redirect to mobile number page
        cy.log("Assert that mobile number page has been loaded")
        cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateMobile)
        cy.mobileVerification(email)

        //Validate
        cy.log("Verify redirect to today page")
        cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateActivate)
        cy.log("Take screenshot")
        // cy.screenshot()


    })


    it('C2012 Verify That The User is Able To Signup With Email Using Virtual Company.', function () {

        this.test.testcaseId = 2012
        //Automation

        cy.log("Assert Company Search page has been loaded")
        // cy.wait(2000)
        cy.waitFor(ObjectSignup.textCompanySearch)
        cy.log("Input Company's Name in the search field")
        cy.get(ObjectSignup.textCompanySearch).type(TESTDATA.signup.virtualCompany)

        //Invoke Server to fetch all network XHR requests
        // cy.server()
        cy.intercept("GET", '' + Cypress.env('baseUrlapi') + ObjectApiEndPoint.apiLocationQuery + TESTDATA.signup.virtualCompany + '').as('verifiedCompanies')
        cy.wait('@verifiedCompanies').its('response.statusCode').should('eq', 200)
        // cy.wait(2000)
        cy.waitFor(ObjectSignup.listSelectCompany)
        cy.log("Select the Existing Company from the drop down")
        cy.get(ObjectSignup.listSelectCompany).click()
        cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateProfile)


        firstName = Faker.name.firstName()
        lastName = Faker.name.lastName()
        email = "auto" + Faker.random.uuid() + "@yopmail.net"

        // Sign up button click & Input Data
        cy.log("Select Email signup button")
        cy.get(ObjectSignup.buttonSignupEmail).click()
        cy.log("Input First name")
        cy.get(ObjectSignup.textFname).type(firstName)
        cy.log("Input last name")
        cy.get(ObjectSignup.textLname).type(lastName)
        cy.log("Input Email address")
        cy.get(ObjectSignup.textEmail).type(email)
        cy.log("Input Password")
        cy.get(ObjectSignup.textPassword).type(TESTDATA.signup.password)
        cy.log("Submit form")
        cy.get(ObjectSignup.buttonSubmit).click()
        //Assert redirect to mobile number page
        cy.log("Assert that mobile number page has been loaded")
        cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateMobile)

        // Mobile Verification
        cy.mobileVerification(email)
        cy.generalConfigCutoffTime()

        //Validate
        cy.log("Verify redirect to today page")
        cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateMenu)

    })
})
