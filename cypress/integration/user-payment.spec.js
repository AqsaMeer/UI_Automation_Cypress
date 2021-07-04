/// <reference types="Cypress" />
const TESTDATA = require('../fixtures/' + Cypress.env('fixtureFile') + '')

//Import required Page Object classes
import PageHeader from '../pageobjects/PageHeader'
import PageMenu from '../pageobjects/PageMenu.js'
import PageAccount from '../pageobjects/PageAccount'
import PageChat from '../pageobjects/PageChat'
import PageApiEndPoints from '../pageobjects/PageApiEndPoints'
import PageAccountPayment from '../pageobjects/PageAccountPayment'
import Faker from 'faker'

const ObjectMenu = new PageMenu()
const ObjectAccount = new PageAccount()
const ObjectChat = new PageChat()
const ObjectAPIEndPoint = new PageApiEndPoints()
const ObjectPayment = new PageAccountPayment()
const ObjectHeader = new PageHeader()



describe('Add, Remove, Set default Payment card', function () {
    beforeEach(function () {
        Cypress.Cookies.preserveOnce('userToken_UAE')
        Cypress.Cookies.preserveOnce('userToken_KSA')

    })
    before(function () {
        // Signup WIth API
        let email = "auto" + Faker.random.uuid() + "@yopmail.net"
        cy.log("Sign up with Api")
        let firstName = Faker.name.firstName()
        cy.userSignupApi(firstName, email, TESTDATA.signup.password)
        cy.log("Visit User Profile")
        cy.visit(ObjectHeader.navigateProfilePayment)
        cy.get(ObjectChat.chatIcon).should('be.visible')
        cy.getUserID(email, TESTDATA.signup.password).then(returnedUserID => {
            // Delete Every Promo
            cy.deleteUserPromos(returnedUserID, "")
        })

    })

    afterEach(function () {
        if (this.currentTest.state === 'passed') {
            cy.passTest(this.currentTest.testcaseId)
        }
        if (this.currentTest.state === 'failed') {
            cy.failTest(this.currentTest.testcaseId)
            cy.sendSlackNotification(this.currentTest.title, this.currentTest.err.stack)
            Cypress.runner.stop()
        }

    });


    it('C44376 Add Card Profile Page', function () {
        this.test.testcaseId = 44376

        // Add First Card
        cy.get(ObjectPayment.addCardButton).click()
        cy.get(ObjectPayment.cardNumber).type(TESTDATA.cardDetails.number)
        cy.log("Add card Expiry, month and year")
        cy.get(ObjectPayment.cardExpiry).type(TESTDATA.cardDetails.expiry)
        cy.log("Add card CVV")
        cy.get(ObjectPayment.cardCVV).type(TESTDATA.cardDetails.cvv)
        // cy.server()
        cy.intercept("POST", '' + Cypress.env('baseUrlapi') + ObjectAPIEndPoint.apiAddCard).as('addcard')
        cy.get(ObjectPayment.saveCard).click()
        cy.wait('@addcard').its('response.statusCode').should('eq', 200)
        cy.reload()
        cy.get(ObjectPayment.cardIcon).should('be.visible')


        // Add Second Card
        cy.log("Add another card")
        cy.get(ObjectPayment.addCardButton).click()
        cy.log('CKOConfig')
        cy.get(ObjectPayment.cardNumber).type(TESTDATA.cardDetails1.number)
        cy.log("Add card Expiry, month and year")
        cy.get(ObjectPayment.cardExpiry).type(TESTDATA.cardDetails1.expiry)
        cy.log("Add card CVV")
        cy.get(ObjectPayment.cardCVV).type(TESTDATA.cardDetails1.cvv)
        cy.log("Assert Save Card is clickable and then click")
        cy.get(ObjectPayment.saveCard).click()
        cy.wait('@addcard').its('response.statusCode').should('eq', 200)
        // XHR Response Verification
        cy.intercept("GET", '' + Cypress.env('baseUrlapi') + ObjectAPIEndPoint.apiUserCards, (req) => {
            req.reply((res) => {
                expect(res.body.body.cards[0]).to.have.property('default', true)

            })
        }).as('userCards')
        cy.reload()
        cy.get(ObjectPayment.cardIcon).should('be.visible')
        cy.wait('@userCards').its("response.statusCode").should("eq", 200)   // yields number 200
    })

    it('C44376 Set as Default Card', function () {

        this.test.testcaseId = 44376
        cy.get(ObjectPayment.setDefault).eq(0).click({ multiple: false })
        cy.intercept("GET", '' + Cypress.env('baseUrlapi') + ObjectAPIEndPoint.apiUserCards, (req) => {
            req.reply((res) => {
                expect(res.body.body.cards[0]).to.have.property('default', true)

            })

        }).as('userCards')
        cy.reload()
        cy.wait('@userCards').its('response.statusCode').should('eq', 200)

    })
    it('C44376 Remove Card', function () {

        this.test.testcaseId = 44376
        cy.xpath(ObjectPayment.removeCard).click()
        cy.get(ObjectPayment.cardLast4Digit).contains("9996")
        cy.get(ObjectPayment.confirmRemoveCard).click()
        cy.intercept("GET", '' + Cypress.env('baseUrlapi') + ObjectAPIEndPoint.apiUserCards, (req) => {
            req.reply((res) => {
                expect(res.body.body.cards[0].last4).to.not.equal('9996')

            })

        }).as('userCards')
        cy.reload()
        cy.wait('@userCards').its('response.statusCode').should('eq', 200)
        cy.get(ObjectPayment.cardIcon).should('be.visible')


    })


})


