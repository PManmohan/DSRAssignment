import { test, expect, chromium, Locator } from "@playwright/test";
import WebUIForm from "../Pages/DSRTestWebUI";


test("Verify page title", async ({ page }) => {
    const webui = new WebUIForm(page);
    await webui.navigate();
    await webui.VerifyTitle('Web UI Playground');
})

test("Verify first name and last name input field", async ({ page }) => {

    const webui = new WebUIForm(page);
    await webui.navigate();

    //Error message for fistname and lastname not visible
    await webui.ErrorMessageVisible(webui.firstNameError, false);
    await webui.ErrorMessageVisible(webui.lastNameError, false);


    await webui.ClickOnSubmit();
    await webui.ErrorMessageVisible(webui.firstNameError, true);

    await webui.fillFirstName('a');
    await webui.ErrorMessageVisible(webui.firstNameError, true);

    await webui.fillFirstName('ab');
    await webui.ErrorMessageVisible(webui.firstNameError, false);

    await webui.fillFirstName('abc');
    await webui.ErrorMessageVisible(webui.firstNameError, false);

    await webui.fillFirstName('');
    await webui.ErrorMessageVisible(webui.firstNameError, true);

    await webui.fillFirstName('aaaaaaaaaaaaaaaaaaaaaaaaa');//25 characters allowed
    await webui.ErrorMessageVisible(webui.firstNameError, false);

    await webui.fillFirstName('aaaaaaaaaaaaaaaaaaaaaaaaaa');//Error for 26 characters
    await webui.ErrorMessageVisible(webui.firstNameError, true);


    //--------------verify last name
    await webui.ErrorMessageVisible(webui.lastNameError, true);

    await webui.fillLastName('p');
    await webui.ErrorMessageVisible(webui.lastNameError, true);

    await webui.fillLastName('pq');
    await webui.ErrorMessageVisible(webui.lastNameError, false);

    await webui.fillLastName('pqr');
    await webui.ErrorMessageVisible(webui.lastNameError, false);

    await webui.fillLastName('');
    await webui.ErrorMessageVisible(webui.lastNameError, true);

    await webui.fillLastName('aaaaaaaaaaaaaaaaaaaaaaaaa');//25 characters allowed
    await webui.ErrorMessageVisible(webui.lastNameError, false);

    await webui.fillLastName('aaaaaaaaaaaaaaaaaaaaaaaaaa');//Error for 26 characters
    await webui.ErrorMessageVisible(webui.lastNameError, true);

})

test("Submit form without filling any details", async ({ page }) => {

    const webui = new WebUIForm(page);
    await webui.navigate();
    await webui.SubmitWithEmptyFieldsAndVerifyErrro();
})

test("Verify email input field", async ({ page }) => {

    const webui = new WebUIForm(page);
    await webui.navigate();

    //Error message for email not visible
    await webui.ErrorMessageVisible(webui.emailError, false);

    await webui.ClickOnSubmit();
    await webui.ErrorMessageVisible(webui.emailError, true);

    await webui.invalidEmailIds(['a', 'ab', 'ab@', 'a.p@com', 'abcpqr@.com', 'abcpqr.@com', '@abcpqr.com', 'a@bcpqr', 'abc pqr@bcpqr.com', 'abcpqr@xyz.c', 'abcpqr@xyz.com.']);

    await webui.validEmailIds(['abcpqr@xyz.com', 'a.p@xyz.com', 'a.p@xyz.co', '1a.p@xdy.co', '#.p@xdy.co', 'aaaaaaaaaaaaaaaaaaaaaaaaabcpqr@xyz.com']);

})

test("Verify phone number input field", async ({ page }) => {

    const webui = new WebUIForm(page);
    await webui.navigate();

    //Error message for phone number not visible
    await webui.ErrorMessageVisible(webui.phoneNumberError, false);

    await webui.ClickOnSubmit();
    await webui.ErrorMessageVisible(webui.phoneNumberError, true);

    await webui.phoneNumber.fill('123454564');

    //await page.pause();
    await webui.invalidPhoneNumber(['123456', '12345a', 'a23456', '123456a', 'a123456', '1234567891011', '123456789101a']);

    await webui.validPhoneNumber(['1234567', '12345678', '123456789', '12345678910', '0123456', '0000000']);

})

test("Verify vacancy select", async ({ page }) => {

    const webui = new WebUIForm(page);
    await webui.navigate();

    await webui.SelectVacancy('Business Analyst');
})

test("Verify gender radio field", async ({ page }) => {

    const webui = new WebUIForm(page);
    await webui.navigate();

    //Error message for gender not visible
    await webui.ErrorMessageVisible(webui.genderError, false);

    await webui.ClickOnSubmit();
    await webui.ErrorMessageVisible(webui.genderError, true);

    await webui.SelectGender('Male');
    await webui.ErrorMessageVisible(webui.genderError, false);


    await webui.navigate();

    //Error message for gender not visible
    await webui.ClickOnSubmit();
    await webui.ErrorMessageVisible(webui.genderError, true);
    await webui.SelectGender('Female');
    await webui.ErrorMessageVisible(webui.genderError, false);

})

test("Verify attachment", async ({ page }) => {

    const webui = new WebUIForm(page);
    await webui.navigate();

    await webui.uploadFile('TestFileforUpload.txt')
})

test("Verify conscent checkbox", async ({ page }) => {

    const webui = new WebUIForm(page);
    await webui.navigate();

    await webui.ErrorMessageVisible(webui.conscentError, false);

    await webui.ClickOnSubmit();
    await webui.ErrorMessageVisible(webui.conscentError, true);
    await webui.ConsentCheckboxOperation()
})

test("Submit form with valid inputs", async ({ page }) => {

    const webui = new WebUIForm(page);
    await webui.navigate();
    await webui.fillFirstName('abc');
    await webui.fillLastName('pqr');
    await webui.email.fill('abc.pqr@xyz.com');
    await webui.phoneNumber.fill('12345678');
    await webui.SelectGender('Male');
    await webui.SelectVacancy('Business Analyst');
    await webui.uploadFile('TestFileforUpload.txt');
    await webui.Agreement.check();
    await webui.ConfirmSubmissionAlert('{"FirstName":"abc","LastName":"pqr","Email":"abc.pqr@xyz.com","PhoneNumber":"12345678","Gender":"Male","Vacancy":"Business Analyst","CV":{},"Agreement":true}');

})
