class PageHeader {
    constructor() {
        //CSS selectors and XPATHS for the Header Page
        this.linkLogin = "(.//a[@class='c-hand login-link'])[1]"
        this.linkSignup = "(.//a[@href='/register/location'])[1]"
        this.rewardButton = "(//div[@id='header']//a[@href='/invite'])[1]"
        this.hamburger = ".hamburger"
        this.dailyMenuIcon = "[class='active']"
        this.account = "a[href='/profile']"
        this.myOrders = "a[href = '/orders']"

        // Header Navigations
        // Locaters for Header

        /// Navigation -> Page Navigation
        this.navigateMenu = "/today"
        this.navigateProfile = "/profile"
        this.navigateLocation = "/location"
        this.navigateMobile = "/mobile"
        this.navigateActivate = "/activate"
        this.navigateProfilePassword = "/profile#password"
        this.navigateProfileNotification = "/profile#notifications"
        this.navigateProfilePayment = "/profile#payment"
        this.navigateResetPassword = "/password/reset/"
        this.navigateAdminPanelLogin = "/admin-login"
        this.navigateAddCompany = "/add-company"
        this.navigateOrders = "/orders"
        this.navigatePro = "/pro"

    }
}
export default PageHeader