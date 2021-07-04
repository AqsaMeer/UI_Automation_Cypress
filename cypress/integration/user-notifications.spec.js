/// <reference types="Cypress" />
const TESTDATA = require('../fixtures/' + Cypress.env('fixtureFile') + '')

//Import required Page Object classes

import PageAccountNotifications from '../pageobjects/PageAccountNotifications'
import PageMenu from '../pageobjects/PageMenu.js'
import PageAccount from '../pageobjects/PageAccount'
import PageChat from '../pageobjects/PageChat'
import PageHeader from '../pageobjects/PageHeader'
import PageApiEndPoints from '../pageobjects/PageApiEndPoints'
import Faker from 'faker'

const ObjectNotifications = new PageAccountNotifications()
const ObjectMenu = new PageMenu()
const ObjectAccount = new PageAccount()
const ObjectChat = new PageChat()
const ObjectHeader = new PageHeader()
const ObjectApiEndPoints = new PageApiEndPoints()

//Variable Declaration

let email = ''
describe('User Notifications', function () {

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('userToken_UAE')
    Cypress.Cookies.preserveOnce('userToken_KSA')

  })


  before(function () {

    email = "auto" + Faker.random.uuid() + "@yopmail.net"
    cy.log("Sign up with Api")
    let firstName = Faker.name.firstName()
    cy.userSignupApi(firstName, email, TESTDATA.signup.password)

    cy.log("Open the URL")
    // cy.server()
    cy.intercept("GET", '' + Cypress.env('baseUrlapi') + ObjectApiEndPoints.apiGeneralConfig).as('generalConfig')
    cy.visit(ObjectHeader.navigateProfileNotification)
    cy.wait('@generalConfig').its('response.statusCode').should('eq', 200)
    cy.get(ObjectChat.chatIcon).should('be.visible')

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


  it('C2240 Disable all Notifications and Verify', function () {
    this.test.testcaseId = 2240
    //Automation

    cy.waitFor(ObjectNotifications.breakfastEmail)
    cy.wait(5000)
    cy.log("Uncheck Breakfast Email")
    cy.get(ObjectNotifications.breakfastEmail).click({ force: true })

    cy.log("Uncheck Lunch Email")
    cy.get(ObjectNotifications.lunchEmail).click({ force: true })
    cy.log("Click on Disable button")
    cy.xpath(ObjectNotifications.submitDisableButton).click({ force: true })

    cy.log("Uncheck Lunch SMS")
    cy.get(ObjectNotifications.lunchMobile).click({ force: true })
    cy.log("Click on Disable button")
    cy.xpath(ObjectNotifications.submitDisableButton).click({ force: true })

    cy.log("Uncheck weekly Menu")
    cy.get(ObjectNotifications.weeklyEmail).click({ force: true })

    cy.log("Uncheck Marketing Email")
    cy.get(ObjectNotifications.marketingEmail).click({ force: true })

    cy.log("Uncheck Marketing Sms")
    cy.get(ObjectNotifications.marketingSms).click({ force: true })

    cy.log("Save Notification Changes")
    cy.xpath(ObjectNotifications.saveButton).click()
    cy.log("Verify redirect to today page")
    cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateMenu);
    cy.log("Verify Welcome Popup Appears")
    cy.get(ObjectMenu.proPopUp).should('be.visible')
    cy.log("Close Pro Popup")
    cy.get(ObjectMenu.closePopup).click()
    cy.readFile('data_files/accessToken.txt').then((token) => {
      cy.request({
        method: 'GET',
        url: '' + Cypress.env('baseUrlapi') + ObjectApiEndPoints.apiNotificationSettings,
        headers: { "Content-Type": "application/json;charset=UTF-8", "Origin": "" + Cypress.config().baseUrl + "", "Authorization": "Bearer " + token + " " },
      })
        //Tests
        .its('body')
        .then((body) => {
          var response = JSON.stringify(body)
          cy.log(response)
          expect(body.status).to.eq(200)
          expect(body.body.isBreakfastEmailActive).to.eq(false)
          expect(body.body.isBreakfastMobileActive).to.eq(false)
          expect(body.body.isEmailActive).to.eq(false)
          expect(body.body.isMobileActive).to.eq(false)
          expect(body.body.sendWeeklyEmails).to.eq(false)
          expect(body.body.sendMarketingEmails).to.eq(false)
          expect(body.body.sendMarketingSms).to.eq(false)
          expect(body.body.cutOffTimeReminder).to.eq(false)

        })
    })
  })



  it('C2240 Enable all Notifications and Verify', function () {
    this.test.testcaseId = 2240

    cy.log("Open the URL")
    cy.intercept("GET" + '' + Cypress.env('baseUrlapi') + ObjectApiEndPoints.apiGeneralConfig).as('generalConfig')
    cy.visit(ObjectHeader.navigateProfileNotification)
    // cy.wait('@generalConfig').its('response.statusCode').should('eq', 200)
    cy.get(ObjectChat.chatIcon).should('be.visible')
    cy.wait(5000)
    cy.waitFor(ObjectNotifications.breakfastEmail)
    cy.log("check Breakfast Email")
    cy.get(ObjectNotifications.breakfastEmail).click({ force: true })

    cy.log("check Breakfast Mobile")
    cy.get(ObjectNotifications.breakfastMobile).click({ force: true })

    cy.log("check Lunch Email")
    cy.get(ObjectNotifications.lunchEmail).click({ force: true })

    cy.log("check Lunch SMS")
    cy.get(ObjectNotifications.lunchMobile).click({ force: true })

    cy.log("check cutoff time ")
    cy.get(ObjectNotifications.remindMeToOrder).click({ force: true })

    cy.log("check weekly Menu")
    cy.get(ObjectNotifications.weeklyEmail).click({ force: true })

    cy.log("check Marketing Email")
    cy.get(ObjectNotifications.marketingEmail).click({ force: true })

    cy.log("check Marketing Sms")
    cy.get(ObjectNotifications.marketingSms).click({ force: true })

    cy.log("Save Notification Changes")
    cy.xpath(ObjectNotifications.saveButton).click()
    cy.log("Verify redirect to today page")
    cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateMenu);
    cy.readFile('data_files/accessToken.txt').then((token) => {
      cy.request({
        method: 'GET',
        url: '' + Cypress.env('baseUrlapi') + ObjectApiEndPoints.apiNotificationSettings,
        headers: { "Content-Type": "application/json;charset=UTF-8", "Origin": "" + Cypress.config().baseUrl + "", "Authorization": "Bearer " + token + " " },
      })
        //Tests
        .its('body')
        .then((body) => {
          var response = JSON.stringify(body)
          cy.log(response)
          expect(body.status).to.eq(200)
          expect(body.body.isBreakfastEmailActive).to.eq(true)
          expect(body.body.isBreakfastMobileActive).to.eq(true)
          expect(body.body.isEmailActive).to.eq(true)
          expect(body.body.isMobileActive).to.eq(true)
          expect(body.body.sendWeeklyEmails).to.eq(true)
          expect(body.body.sendMarketingEmails).to.eq(true)
          expect(body.body.sendMarketingSms).to.eq(true)
          expect(body.body.cutOffTimeReminder).to.eq(true)

        })
    })
  })



  it('C44374 Verify Daily Menu Preference VEG', function () {
    this.test.testcaseId = 44374

    cy.log("Open the URL")
    cy.intercept("GET", '' + Cypress.env('baseUrlapi') + ObjectApiEndPoints.apiGeneralConfig).as('generalConfig')
    cy.visit(ObjectHeader.navigateProfileNotification)
    cy.wait('@generalConfig').its('response.statusCode').should('eq', 200)
    cy.get(ObjectChat.chatIcon).should('be.visible')
    cy.wait(5000)
    cy.waitFor(ObjectNotifications.veg)
    cy.log("click on meal prefrence VEG")
    cy.get(ObjectNotifications.veg).click()

    cy.xpath(ObjectNotifications.saveButton).click()
    cy.log("Verify redirect to today page")
    cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateMenu);
    cy.readFile('data_files/accessToken.txt').then((token) => {
      cy.request({
        method: 'GET',
        url: '' + Cypress.env('baseUrlapi') + ObjectApiEndPoints.apiNotificationSettings,
        headers: { "Content-Type": "application/json;charset=UTF-8", "Origin": "" + Cypress.config().baseUrl + "", "Authorization": "Bearer " + token + " " },
      })
        //Tests
        .its('body')
        .then((body) => {
          var response = JSON.stringify(body)
          cy.log(response)
          expect(body.status).to.eq(200)
          cy.log("Verify dailyMenuPreference set to VEG ")
          expect(body.body.dailyMenuPreference).to.eq(2)
        })
    })


  })



  it('C44374 Verify Daily Menu Preference MEAT', function () {
    this.test.testcaseId = 44374

    cy.intercept("GET", '' + Cypress.env('baseUrlapi') + ObjectApiEndPoints.apiGeneralConfig).as('generalConfig')
    cy.visit(ObjectHeader.navigateProfileNotification)
    cy.wait('@generalConfig').its('response.statusCode').should('eq', 200)
    cy.get(ObjectChat.chatIcon).should('be.visible')
    cy.wait(5000)
    cy.waitFor(ObjectNotifications.meat)
    cy.log("click on meal prefrence MEAT")
    cy.get(ObjectNotifications.meat).click()

    cy.xpath(ObjectNotifications.saveButton).click()
    cy.log("Verify redirect to today page")
    cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateMenu);
    cy.readFile('data_files/accessToken.txt').then((token) => {
      cy.request({
        method: 'GET',
        url: '' + Cypress.env('baseUrlapi') + ObjectApiEndPoints.apiNotificationSettings,
        headers: { "Content-Type": "application/json;charset=UTF-8", "Origin": "" + Cypress.config().baseUrl + "", "Authorization": "Bearer " + token + " " },
      })
        //Tests
        .its('body')
        .then((body) => {
          var response = JSON.stringify(body)
          cy.log(response)
          expect(body.status).to.eq(200)
          cy.log("Verify dailyMenuPreference set to MEAT ")
          expect(body.body.dailyMenuPreference).to.eq(1)
        })
    })

  })
  it('C44374 Verify Daily Menu Preference  HEALTY', function () {
    this.test.testcaseId = 44374

    cy.intercept("GET", '' + Cypress.env('baseUrlapi') + ObjectApiEndPoints.apiGeneralConfig).as('generalConfig')
    cy.visit(ObjectHeader.navigateProfileNotification)
    cy.wait('@generalConfig').its('response.statusCode').should('eq', 200)
    cy.get(ObjectChat.chatIcon).should('be.visible')
    cy.wait(5000)
    cy.waitFor(ObjectNotifications.lite)
    cy.log("click on meal prefrence HEALTY")
    cy.get(ObjectNotifications.lite).click()

    cy.xpath(ObjectNotifications.saveButton).click()
    cy.log("Verify redirect to today page")
    cy.location('pathname', { log: false }, { timeout: 120000 }).should('include', ObjectHeader.navigateMenu);
    cy.readFile('data_files/accessToken.txt').then((token) => {
      cy.request({
        method: 'GET',
        url: '' + Cypress.env('baseUrlapi') + ObjectApiEndPoints.apiNotificationSettings,
        headers: { "Content-Type": "application/json;charset=UTF-8", "Origin": "" + Cypress.config().baseUrl + "", "Authorization": "Bearer " + token + " " },
      })
        //Tests
        .its('body')
        .then((body) => {
          var response = JSON.stringify(body)
          cy.log(response)
          expect(body.status).to.eq(200)
          cy.log("Verify dailyMenuPreference set to HEALTY ")
          expect(body.body.dailyMenuPreference).to.eq(3)
        })

    })
  })
})