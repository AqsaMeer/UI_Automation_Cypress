class PageSignup {
        constructor() {

                //CSS selectors and XPATHS for the SignUp Page
                this.textCompanySearch = "input[name='company']";
                this.listSelectCompany = "ul#select-company>li#rbt-menu-item-0";
                this.buttonSignupEmail = "button[class='btn btn-block btn-secondary bold social-btn btn-email mb-2']";
                this.textFname = "input[name='firstName']";
                this.textLname = "input[name='lastName']";
                this.textEmail = "input[name='email']";
                this.textPassword = "input[name='password']";
                this.buttonSubmit = "button[type='submit']";
                this.textPhonenumber = "input[type = tel]";
                this.mobileVerificationCodeInputField1 = "(//input[@type='tel'])[2]";
                this.mobileVerificationCodeInputField2 = "(//input[@type='tel'])[3]";
                this.mobileVerificationCodeInputField3 = "(//input[@type='tel'])[4]";
                this.mobileVerificationCodeInputField4 = "(//input[@type='tel'])[5]";
                this.emailExistError = "[data-testid='errorField']"
                this.lunchNotifyPopUp = "[class='modal-dialog relative']"
                this.residenceOption = "input[value='residence']"
                this.addressOptionConfirm = "div.modal-footer>button[type='submit']"
                this.apartmentNumber = "input[name='apartment']"
                this.officeFloor = "input[name='floor']"
                this.address = "input[name='address']"
        }
}
export default PageSignup