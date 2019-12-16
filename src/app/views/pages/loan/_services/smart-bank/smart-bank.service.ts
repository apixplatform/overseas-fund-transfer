import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// import * as hardcoded from '../../../../../../../api-config.json';
import { AccountJson } from '../_models/smartbank/account-json';
import { AppConfigService } from '../../../../../core/_config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SmartBankService {

  private config: any = AppConfigService.apiConfig;

  constructor(private http: HttpClient) { }

  createParty(APIXToken: string, accountName: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders().set('X-Authorization', 'bearer ' + APIXToken);

    const request = {
      'bankId': this.config.smartbank.bankId,
      'canGaurantee': 'Y',
      'canOpenAccounts': 'Y',
      'description': accountName,
      'isDebarred': 'N',
      'makerDate': '2019-10-12T15:24:06.423Z',
      'makerId': 'string',
      'partyType': this.config.smartbank.partyType
    }

    return this.http.post(this.config.smartbank.createPartyUrl, request, { headers });
  }

  createAccount(APIXToken: any, name: string, nick: string, scheme: string, cardFacility: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders().set('X-Authorization', 'bearer ' + APIXToken);

    const request: AccountJson = {
      'accountClosingDate': '2019-10-12T11:38:01.711Z',
      'accountCurrency': 'SGD',
      'accountName': name,
      'accountOpeningDate': '2019-10-12T11:38:01.711Z',
      'accountTypeId': this.config.smartbank.accountTypeId,
      'accountrefnumber': 'string',
      'balance': 0,
      'bankId': this.config.smartbank.bankId,
      'branchId': this.config.smartbank.branchId,
      'cardFacility': cardFacility,
      'checkerDate': '2019-10-12T11:38:01.711Z',
      'checkerId': 'string',
      'chequebookFacility': 'Y',
      'creditDebitIndicator': 'Credit',
      'creditLineAmount': 0,
      'creditLineIncluded': 'N',
      'creditLineType': 'Emergency',
      'frozen': 'N',
      'isjointaccount': 'N',
      'isonlineaccessenabled': 'Y',
      'makerDate': '2019-10-12T11:38:01.711Z',
      'makerId': 'string',
      'modifiedDate': '2019-10-12T11:38:01.711Z',
      'nickname': nick,
      'noCredit': 'Y',
      'noDebit': 'N',
      'nomineeAddress': 'string',
      'nomineeDob': '2019-10-12T11:38:01.711Z',
      'nomineeName': 'string',
      'nomineePhoneNo': 'string',
      'nomineeRelatonship': 'string',
      'passbookFacility': 'Y',
      'productId': this.config.smartbank.productId,
      'schemeName': scheme,
      'status': 'string',
      'typeOfBalance': 'ClosingAvailable',
      'usage': 'Y'
    }

    return this.http.post(this.config.smartbank.createAccountUrl, request, { headers });
  }

  setOwner(APIXToken: any, accountId: any, partyId: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders().set('X-Authorization', 'bearer ' + APIXToken);

    const request = {
      'accountId': accountId,
      'checkerDate': '2019-10-12T11:43:04.488Z',
      'checkerId': 'string',
      'endDate': '2019-10-12T11:43:04.488Z',
      'isPrimaryOwner': 'Y',
      'makerDate': '2019-10-12T11:43:04.488Z',
      'makerId': 'string',
      'modifiedBy': 'string',
      'modifiedDate': '2019-10-12T11:43:04.488Z',
      'partyId': partyId,
      'percentageOfShare': 100,
      'startDate': '2019-10-12T11:43:04.488Z',
      'status': 'Active'
    }

    return this.http.post(this.config.smartbank.setOwnersUrl, request, { headers });
  }

  applyLoan(APIXToken: string, accountId: string, amt: number): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders().set('X-Authorization', 'bearer ' + APIXToken);

    const request = {
      accountId,
      accruedInterest: 0,
      accruedPenalty: 0,
      approvedDate: '2019-08-15T08:11:27.578Z',
      assetIdRef: 1000000003,
      bankId: this.config.smartbank.bankId,
      checkerDate: '2019-08-15T08:11:27.578Z',
      checkerId: '1',
      closedDate: '2019-08-15T08:11:27.578Z',
      collectionRecoveryFee: 0,
      creditOriginRef: 1000000008,
      endDate: '2019-08-15T08:11:27.578Z',
      feesBalance: 0,
      feesDue: 0,
      feesPaid: 0,
      gracePeriod: 0,
      gracePeriodType: 'none',
      hasCustomSchedule: 'Y',
      installmentAmount: 0,
      interestApplicationMethod: 'on_repayment',
      interestBalance: 0,
      interestCalculationMethod: 'flat',
      interestChargeFrequence: 'annualized',
      interestDue: 0,
      interestSpread: 0,
      issueDate: '2019-08-15T08:11:27.578Z',
      lastAccountAppraisalDate: '2019-08-15T08:11:27.578Z',
      lastLockedDate: '2019-08-15T08:11:27.578Z',
      lastPymntAmnt: 0,
      lastPymntDate: '2019-08-15T08:11:27.578Z',
      lastSetToArrearsDate: '2019-08-15T08:11:27.578Z',
      lastinterestAppliedDate: '2019-08-15T08:11:27.578Z',
      lasttaxRateReviewDate: '2019-08-15T08:11:27.578Z',
      lineOfCreditId: 0,
      loanAccountCurrency: 'SGD',
      loanContractId: 'string',
      loanName: 'string',
      loanPenaltyCalculationMethod: 'overdue_balance',
      loanRefNumber: new Date().getTime(),
      makerDate: '2019-08-15T08:11:27.578Z',
      makerId: 'string',
      modifiedBy: 'string',
      modifiedDate: '2019-08-15T08:11:27.578Z',
      nextPymntDate: '2019-08-15T08:11:27.578Z',
      paymentMethod: 'horizontal',
      paymentfrequency: 'interval',
      penaltyBalance: 0,
      penaltyDue: 0,
      penaltyPaid: 0,
      periodicPayment: 0,
      principalBalance: 0,
      principalRepaymentInterval: 0,
      productKey: 0,
      recoveries: 0,
      repaymentInstallments: 0,
      repaymentPeriodCount: 0,
      repaymentPeriodUnit: 'days',
      repaymentScheduleMethod: 'fixed',
      scheduleDuedatesMethod: 'interval',
      status: 'string',
      subStatus: 'active',
      taxRate: 0,
      term: 'string',
      totalLoanAmountFunded: amt,
      totalPrincipleAmnt: 0,
      totalPymntTillDate: 0,
      totalRecInt: 0,
      totalRecLateFee: 0,
      totalRecPrncp: 0,
      type: 'string',

      verificationStatus: 'string',
      paymentId: 1000000001,
      paymentRefId: 1664423741000000001,
      loanAccountId: 1000000004,
      loanBankId: 1003,
      currencyCode: "SGD",
      transactionType: "CREATION",
      bankLocation: "Colombo",
      counterPartyBankLocation: "Colombo",
      purpose: "Loan - " + amt,
      balanceType: "OpeningBooked",
      balanceCreditDebitIndicator: "Credit"
    };

    return this.http.post(this.config.smartbank.loanUrl, request, { headers });
  }

  login(APIXToken: string, email: string, password: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders().set('X-Authorization', 'bearer ' + APIXToken);

    const request = {
      email,
      password
    };

    return this.http.post(this.config.smartbank.loginUrl, request, { headers });
  }

  getAccNo(APIXToken: string, partyId: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders().set('X-Authorization', 'bearer ' + APIXToken);

    return this.http.get(this.config.smartbank.accountsUrl + '/' + partyId, { headers });
  }

  getAccData(APIXToken: string, accNo: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders().set('X-Authorization', 'bearer ' + APIXToken);

    return this.http.get(this.config.smartbank.getAccountUrl + '/' + accNo, { headers });
  }

  verifyEmail(APIXToken: string, email: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders().set('X-Authorization', 'bearer ' + APIXToken);

    let params: HttpParams = new HttpParams();
    params = params.append('email', email);
    return this.http.get(this.config.smartbank.emailValidationUrl, {
      headers,
      params
    });
  }

  createUserLogin(
    APIXToken: any,
    partyId: any,
    email: string,
    password: string,
    nickname: string,
    accountHolderName: string
  ): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders().set(
      'X-Authorization',
      'bearer ' + APIXToken
    );

    const request = {
      alterDate: '2019-11-06T08:56:06.434Z',
      bankId: this.config.smartbank.bankId,
      blockchainContract: '',
      checkerDate: '2019-11-06T08:56:06.434Z',
      checkerId: 'string',
      countryCode: 'SG',
      email: email,
      enabled: 'Y',
      firstName: accountHolderName,
      langCode: 'ENG',
      lastLogin: '2019-11-06T08:56:06.434Z',
      lastName: 'string',
      loginId: email,
      makerDate: '2019-11-06T08:56:06.434Z',
      makerId: 'string',
      manager: 'string',
      modifiedBy: 'string',
      modifiedDate: '2019-11-06T08:56:06.434Z',
      partyId: partyId,
      password: password,
      role: 'Service_Provider',
      roleId: 1,
      userId: 0,
      userRoleId: 1
    };

    return this.http.post(this.config.smartbank.createUserLoginUrl, request, {
      headers
    });


  }

  giftMoney(APIXToken: string, accountId: number, amount: number): Observable<any> {

    const payload = {
      // "accountId": accountId,
      "balance": 0, "balanceCreditDebitIndicator": "Debit", "balanceType": "ClosingAvailable",
      "bankId": 1008, "bankLocation": "1", "bookingDateTime": "2019-08-16T11:57:47.320Z",
      "counterPartyAccountId": accountId, "counterPartyBankId": 1008,
      "counterPartyBankLocation": "1", "currencyCode": "AED", "makerDate":
        "2019-08-16T11:57:47.320Z", "makerId": "1", "paymentId": 0, "paymentRefId": "1",
      "purpose": "$" + amount + " Salary Credit", "status": "Y", "transactionAmount": amount, "transactionName": "1",
      "transactionReference": "Transfer_Adjustment 1000000001", "transactionType": "CREATION"
    };

    const headers: HttpHeaders = new HttpHeaders().set('X-Authorization', 'bearer ' + APIXToken);
    return this.http.post(`${this.config.dashboard.transferTransactionsUrl}`, payload, { headers });
  }
}
