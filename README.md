# Overseas Fund Transfer Demo

This use case demonstrates a basic prototype of a remittance portal for transferring money to overseas locations using the RemitOnline APIs posted by the FinTech – Avenues Payments India. Using these APIs money can be transferred overseas in two ways: 

-   Quick Transfer – which has higher fee but instant transfer
-   Standard Transfer – which has lower fee but longer duration of transfer

This usecase is built with Angular 8.

## APIs used to implement the use case

1. Smart Bank - Party ([Link](https://apixplatform.com/profile/api-detail?api-id=107))
2. Smart Bank - Account ([Link](https://apixplatform.com/profile/api-detail?api-id=103))
3. Smart Bank - Entitlement ([Link](https://apixplatform.com/profile/api-detail?api-id=109))
4. RemitOnline GateRate API ([Link](https://apixplatform.com/profile/api-detail?api-id=309))
5. RemitOnline AddTransaction API ([Link](https://apixplatform.com/profile/api-detail?api-id=295))
6. RemitOnline Status Check API ([Link](https://apixplatform.com/profile/api-detail?api-id=296))

Login to the [APIX Platform](https://apixplatform.com) and subscribe to the above APIs before continuing to the next step.

## Provision APIX IDE Instance

Note: If you already have an IDE instance running, you don't need to create a new IDE instance. 

1. Login to the [APIX Platform](https://apixplatform.com)
2. From the main menu, go to Sandbox > [Secure Experimentation Sandbox/IDE](https://apixplatform.com/ide/api-ide)
3. Click `Create IDE Instance` button
4. Provide `Name`, `URL`, `Description`, `Password` for the IDE instance and click `Create` button. 
Please note that `URL` should be unique and `Password` must be at least 8 characters long, must contain a number, uppercase, lowercase and a special character.
5. Provide confirmation by clicking on `Create and Launch` button. Wait for the IDE instance to be provisioned.
6. A newly created IDE instance will be opened in a new browser tab. Provide the `Password` and click on `Open IDE` button.
7. Already created IDE instances will appear in `IDE Instance Manager` view. Click on the IDE instance name to re-open the IDE instance
8. Please note that IDE instance will be available for 24 hours. Data should be backed up by pushing code to GitHub before auto termination. One hour before the termination, you can request for an termination extension.

## Setting up the development server

1. Open and login to IDE instance
2. From the main menu, click `View` > `Terminal`.

Execute following commands in Terminal window.

**Note:** If previous use case is running in the IDE Terminal, Press `Ctrl` + `C` to stop. 

1.  Let's change the terminal directory to root `projects` folder

        cd ~/project/

2.  Download the code into IDE instance

        git clone https://github.com/apixplatform/overseas-fund-transfer.git

3.  Use case code is downloaded to IDE instance to the folder `overseas-fund-transfer`. Let's change the terminal directory to `overseas-fund-transfer` folder.

        cd overseas-fund-transfer/

4.  Download Angular dependancies with below commands.

        npm install

5.  Start the Angular application server.

        npm start

To configure the use case,

1. Open `overseas-fund-transfer` >`src`>`assets`>`config`> `api-config.json` from the `Project Explorer` left pane.
2. Provide your APIX credentials.

        "userName": "Replace this with your APIX username",
        "password": "Replace this with your APIX password"

3. Provide the credentials used by the TrustingSocial API.

        "credentials": {
	        "user_name": "Replace with your TrustingSocial API username",
	        "password": "Replace with your TrustingSocial API password"
        },
        "clientCode": "Replace with your TrustingSocial API client code",

5. From the main menu, click `File` > `Save`.

Now the development server is up and running with correct configurations. To open the use case website follow the below instructions.

1. Copy the IDE instance URL from the browser tab. (ex: `https://ide-xxxxxx.services.apixplatform.com/`)
2. Open a new browser tab and paste the copied IDE url. Change the `ide` text to `app` in the URL and open. New URL would look like (ex: `https://app-xxxxxx.services.apixplatform.com/`)

## Testing the use case

1. When starting the application for the first time, you should be directed to the Login Screen.

2. Either login with already existing credentials, or click the link to 'Sign Up'.

    * Logins are processed using the `Smart Bank - Entitlements` API.

    i. On the signup screen, fill in all the inputs and click `Submit` Button.

    * Customer Account will get created with the provided `Account Holder's Name` using `Smart Bank - Party` API.
    * New Account gets created using `Smart Bank - Account` API.
    * Newly created customer will be assigned to the Account as the Account Owner using `Smart Bank - Account` API.

    ii. After logging in or signing up successfully, you should then be redirected to the Dashboard.

3. The Dashboard page displays recent transactions and account balances, and is intended to simulate a web banking portal for the purposes of this demo.

4. Scroll down to the `Overseas Transfer` card. This is where you will begin the remittance process.

5. Fill out the form in the card.
    
    * The default currency conversion selected is SGD to INR; for the purposes of this demo, we have also included GBP to INR and USD to INR.
    * Select the currency from the drop down in `Amount to Send` and `Amount received by beneficiary`.
    * Select a transfer type - `Quick Transfer` or `Standard Transfer`.
    * Enter a value into the `Amount to Send` input field.
    * At this point, the value will be converted by the `RemitOnline GateRate` API, and the associated converted value, conversion rates, and fees will be shown to the user.
    * Select `Next` to go to the next step.

6. You will now be shown the `Beneficiary Details` page.

	* Simply ensure all fields are filled and click `Next`.

7. You will be directed to the `Remitter Details` page.

	* If your conversion is from SGD, this form should appear already filled with sample data. If not, simply ensure all fields are filled, as before.
	* Enter a transaction purpose into the `Purpose` field. This will be displayed in your transaction records.

8. Click `Transfer`. If the transfer is successful, you should be taken to the `Transfer Status` page, and the details of your transfer will be displayed.

	* All the details you entered in the previous screens will be sent to the `RemitOnline AddTransaction` API. If the transfer is successful, a transaction record will be created by the `Smart Bank - Accounts` API.
	* Quick Transfers will be immediately debited from your account, and a transaction record will be created.
	* Standard Transfer will be initiated and your account will only be debited if the transfer is successful.
	* From the `Transfer Status` page, return to the dashboard to check the status of your remittance.

9. Return to the Dashboard after your successful remittance transaction.

10. Scroll back down to the `Overseas Transfer` card.

	* Under `Recent Remittances`, you should see a new record for the transaction you just made, with the status of the transaction displayed as a record right next to it.
	* As mentioned earlier, Quick Transactions are debited immediately, so their status will display as **Transferred**. 
	* If your transfer was a Standard Transfer, you will instead see a button under the `Status` column, labeled `Check`.
	* Click this button to query the `RemitOnline Status Check API` about the status of your transaction. *If the status shows as* **Compliance Check**, *or* **Bank Processing**, *please try again by clicking the refresh icon.* If the status shows as **Rejected**, or **Failed**, then your transaction has not been successful and your balance will not be modified. If the status shows as **Successful**, then your transaction has succeeded, and your balance will be debited shortly.
	* Scroll up to the `My Recent Transactions` table to see your latest transaction, which should be the remittance transaction, and verify that your balance has been reduced by the entered amount.