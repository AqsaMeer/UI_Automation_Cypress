class PageLogin {
    constructor() {
        //CSS selectors and XPATHS for the Login Page
        this.textEmail = "input[name='email']";
        this.textPassword = "input[name='password']";
        this.buttonLogin = "button[type='submit']";
        this.forgetPassword = "[data-testid='forgotPasswordBtn']"
        this.emailInput = "[data-testid='emailInput']"
        this.buttonResetPassword = "[data-testid='resetPasswordBtn']"
        this.successMsg = "[data-testid='successMsg']"
        this.errorMsg = "[data-testid='errorField']"


    }


}
export default PageLogin