import { Locator, Page, expect } from "@playwright/test";


export default class WebUIForm {
    

    readonly url: string = "https://vladimirwork.github.io/web-ui-playground/";
    readonly errorTextColor = 'rgb(224, 18, 18)';
    readonly page: Page;

    //UI elements
    readonly firstName: Locator;
    readonly lastname: Locator;
    readonly email: Locator;
    readonly phoneNumber: Locator;
    readonly Gender: Locator;
    readonly Vacancy: Locator;
    readonly myfile: Locator;
    readonly Agreement: Locator;
    readonly submitbutton: Locator;

    //Error text
    readonly firstNameError: Locator;
    readonly lastNameError: Locator;
    readonly emailError: Locator;
    readonly phoneNumberError: Locator;
    readonly genderError: Locator;
    readonly attachmentError: Locator;
    readonly conscentError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstName = this.page.locator("[name='FirstName']");
        this.lastname = this.page.locator("[name='LastName']");
        this.email = this.page.locator("[name='Email']");
        this.phoneNumber = this.page.locator("[name='PhoneNumber']");
        this.Vacancy = this.page.locator("[name='Vacancy']");
        this.myfile = this.page.locator("[id='myfile']");
        this.Agreement = this.page.locator("[name='Agreement']");
        this.submitbutton = this.page.locator("[name='submitbutton']");
        
        this.firstNameError = this.page.getByText('Valid first name is required.');
        this.lastNameError = this.page.getByText('Valid last name is required.');
        this.emailError = this.page.getByText('Valid email is required.');
        this.phoneNumberError = this.page.getByText('Valid phone number is required.');
        this.genderError = this.page.getByText('Choose your gender');
        this.attachmentError = this.page.getByText('Attach your CV file');
        this.conscentError = this.page.getByText('You must agree to the processing of personal data');
        
    }

    async navigate() {
        await this.page.goto(this.url);
    }

    async FillAndSubmit() {

    }

    async VerifyTitle(title:string) {
        await expect(this.page).toHaveTitle(title);
    }

    async ClickOnSubmit() {
        await this.submitbutton.click();       
    }

    async ConfirmSubmissionAlert(message:string) {
        this.page.on("dialog",async(alert)=>{
            const text =alert.message();
            expect(text).toEqual(message);
            await alert.accept();
        })
        await this.ClickOnSubmit();
    }

    async ErrorMessageVisible(errMessage: Locator, visible: boolean) {

        if (visible) {
            await expect(errMessage).toBeVisible();
            await expect(errMessage).toHaveCSS('color', this.errorTextColor);
        } else {
            await expect(errMessage).toBeHidden();
        }

    }

    async fillFirstName(value: string) {
        await this.firstName.fill(value);
    }

    async fillLastName(value: string) {
        await this.lastname.fill(value);
    }

    async invalidEmailIds(emails: string[]) {
        for (let i = 0; i < emails.length; i++) {
            await this.email.fill(emails[i]);
            await this.ErrorMessageVisible(this.emailError, true);
        }
    }

    async validEmailIds(emails: string[]) {
        //   emails.map(async(x)=>{
        //   await this.email.fill(x);
        //   await expect(this.emailError).toBeVisible();
        //   console.log(x);
        // });

        for (let i = 0; i < emails.length; i++) {
            await this.email.fill(emails[i]);
            await this.ErrorMessageVisible(this.emailError, false);
        }
    }

    async invalidPhoneNumber(phone: string[]) {
        for (let i = 0; i < phone.length; i++) {
            await this.phoneNumber.fill(phone[i]);
            await this.ErrorMessageVisible(this.phoneNumberError, true);
        }
    }

    async validPhoneNumber(emails: string[]) {
        for (let i = 0; i < emails.length; i++) {
            await this.phoneNumber.fill(emails[i]);
            await this.ErrorMessageVisible(this.phoneNumberError, false);
        }
    }

    async SelectGender(gender: string) {
        await this.page.check("input[value='" + gender + "']")
    }

    async SelectVacancy(vacancy: string) {
        await this.Vacancy.selectOption(vacancy);
    }

    async ConsentCheckboxOperation() {
        await this.Agreement.check();
        await this.ErrorMessageVisible(this.conscentError, false);
        await this.Agreement.uncheck();
        await this.ErrorMessageVisible(this.conscentError, true);
    }


    async SubmitWithEmptyFieldsAndVerifyErrro() {
        await this.submitbutton.click();

        await this.ErrorMessageVisible(this.firstNameError, true);
        await this.ErrorMessageVisible(this.lastNameError, true);

        await this.ErrorMessageVisible(this.emailError, true);
        await this.ErrorMessageVisible(this.phoneNumberError, true);
        await this.ErrorMessageVisible(this.genderError, true);
        await this.ErrorMessageVisible(this.attachmentError, true);
        await this.ErrorMessageVisible(this.conscentError, true);

    }

    async uploadFile(path:string) {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.myfile.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles((path));
    }
}