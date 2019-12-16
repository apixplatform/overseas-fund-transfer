import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RemitOnlineService } from '../_services/remit-online/remit-online.service';
import { ApixService } from '../../loan/_services/apix/apix.service';
import { DashboardService } from '../../dashboard/dashboard.service';


@Component({
  selector: 'kt-remittance-remitter',
  templateUrl: './remitter-details.component.html',
  styleUrls: ['./remitter-details.component.scss']
})
export class RemitterDetailsComponent implements OnInit {
  valid = true;
  formDetails: any;

  loading = false;
  errMsg: string;

  remittanceDetails: any;
  transactionDetails: any;
  accountBasicInfo: any;
  currency: any;

  constructor(
    private formBuilder: FormBuilder,
    private apixService: ApixService,
    private remitOnlineService: RemitOnlineService,
    private dashboardService: DashboardService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.remittanceDetails = JSON.parse(localStorage.getItem('remittanceDetails'));
    this.transactionDetails = JSON.parse(localStorage.getItem('transactionDetails'));
    this.accountBasicInfo = JSON.parse(localStorage.getItem("accountDetails"));

    // hardcoded values for demo. Remove if unneeded
    let defaults: any = {
      address: '',
      zip: '',
      country: '',
      tpn: ''
    };

    if (this.transactionDetails && this.transactionDetails.fromcurr === 'SGD') {
      defaults.address = '395 Jalan Besar #03-02, Singapore';
      defaults.zip = '209006';
      defaults.country = 'SG';
      defaults.tpn = '+65 6599 3505';
    }

    console.log(defaults);

    this.formDetails = this.formBuilder.group({
      remittername: [{ value: (this.accountBasicInfo && this.accountBasicInfo.accountName) ? this.accountBasicInfo.accountName : '', disabled: false }],
      remitteraddress1: [{ value: (this.remittanceDetails && this.remittanceDetails.remitteraddress1) ? this.remittanceDetails.remitteraddress1 : defaults.address, disabled: false }],
      remitterzipcode: [{ value: (this.remittanceDetails && this.remittanceDetails.remitterzipcode) ? this.remittanceDetails.remitterzipcode : defaults.zip, disabled: false }],
      remittercountry: [{ value: (this.remittanceDetails && this.remittanceDetails.remittercountry) ? this.remittanceDetails.remittercountry : defaults.country, disabled: false }],
      remittermobileno: [{ value: (this.remittanceDetails && this.remittanceDetails.remittermobileno) ? this.remittanceDetails.remittermobileno : defaults.tpn, disabled: false }],
      remitteremail: [{ value: (this.accountBasicInfo && this.accountBasicInfo.email) ? this.accountBasicInfo.email : '', disabled: false }],
      remitteraccno: [{ value: (this.accountBasicInfo && this.accountBasicInfo.accountId) ? this.accountBasicInfo.accountId : '', disabled: false }],
      tranamount: [{ value: (this.transactionDetails && this.transactionDetails.tranamount) ? this.transactionDetails.tranamount : '', disabled: this.transactionDetails }],
      purpose: [{ value: (this.remittanceDetails && this.remittanceDetails.purpose) ? this.remittanceDetails.purpose : '', disabled: false }],
    });

    this.currency = this.transactionDetails ? this.transactionDetails.fromcurr : '';
  }

  onSubmit(formData: any) {
    this.loading = true;
    this.errMsg = undefined;
    console.log('Received Data', formData);

    if (!formData.remittername || !formData.remitteraddress1 || !formData.remitterzipcode || !formData.remittercountry || !formData.remittermobileno || !formData.remitteremail || !formData.remitteraccno || !this.formDetails.controls.tranamount.value || !formData.purpose) {
      this.valid = false;
      this.loading = false;
    } else {
      this.valid = true;

      this.remittanceDetails.remittername = formData.remittername;
      this.remittanceDetails.remitteraddress1 = formData.remitteraddress1;
      this.remittanceDetails.remitterzipcode = formData.remitterzipcode;
      this.remittanceDetails.remittercountry = formData.remittercountry;
      this.remittanceDetails.remittermobileno = formData.remittermobileno;
      this.remittanceDetails.remitteremail = formData.remitteremail;
      this.remittanceDetails.remitteraccno = formData.remitteraccno;
      this.remittanceDetails.tranamount = this.formDetails.controls.tranamount.value;
      this.remittanceDetails.purpose = formData.purpose;

      this.remittanceDetails.trandate = new Date().toISOString()
      this.remittanceDetails.tranrefno = "REMIT-" + this.makeid(10)

      localStorage.setItem('remittanceDetails', JSON.stringify(this.remittanceDetails));

      this.apixService.getAPIXToken().subscribe(data => {
        const APIXToken = data.access_token;

        if (APIXToken.includes('Invalid')) {
          console.log('error', 'Invalid Credentials', 'Please check if you have set valid APIX credentials in your API config.');
        } else {
          let request = {
            corporateid: "MAYBNK",
            timestamp: new Date().toISOString(),
            userid: this.accountBasicInfo.accountId,
            token: "1782843079",
            remitterdetails: {
              remitteraddress1: this.remittanceDetails.remitteraddress1,
              remittercountry: this.remittanceDetails.remittercountry,
              remitteremail: this.remittanceDetails.remitteremail,
              remitterid: this.accountBasicInfo.accountId,
              remittermobileno: this.remittanceDetails.remittermobileno,
              remittername: this.remittanceDetails.remittername,
              remitterzipcode: this.remittanceDetails.remitterzipcode
            },
            transactiondetails: {
              beneaccno: this.remittanceDetails.beneaccno,
              beneifsc: this.remittanceDetails.beneifsc,
              trantype: "NEFT",
              purpose: this.remittanceDetails.purpose,
              purposecode: "0001",
              trandate: this.remittanceDetails.trandate,
              tranrefno: this.remittanceDetails.tranrefno,
              tranamount: "" + this.remittanceDetails.tranamount
            },
            beneficiarydetails: {
              beneaccoholdername: this.remittanceDetails.beneaccoholdername,
              beneaddress1: this.remittanceDetails.beneaddress1,
              beneemailid: this.remittanceDetails.beneemailid,
              benemobileno: this.remittanceDetails.benemobileno,
              benezipcode: this.remittanceDetails.benezipcode
            }
          }

          this.remitOnlineService.addTransaction(APIXToken, request).subscribe(data => {
            this.completeTransaction(APIXToken);
          }, error => {
            if (error.status == 200) {
              this.completeTransaction(APIXToken);
            } else {
              this.errMsg = "Failed to initiate Transaction.";
            }
          });
        }

      });
    }
  }

  completeTransaction(APIXToken: string) {

    if (this.transactionDetails.trantype === 'normal') {
      this.router.navigate(['../status'], { relativeTo: this.activatedRoute });
    } else {

      const transferObject = {
        "accountId": this.accountBasicInfo.accountId,
        "balance": 0, "balanceCreditDebitIndicator": "Debit", "balanceType": "ClosingAvailable",
        "bankId": 1001, "bankLocation": "1", "bookingDateTime": "2019-08-16T11:57:47.320Z",
        "currencyCode": "AED", "makerDate": "2019-08-16T11:57:47.320Z", "makerId": "1", "paymentId": 0, "paymentRefId": this.remittanceDetails.tranrefno,
        "purpose": this.remittanceDetails.purpose + " - " + this.remittanceDetails.tranrefno, "status": "Y", "transactionAmount": this.remittanceDetails.tranamount, "transactionName": "1",
        "transactionReference": this.remittanceDetails.tranrefno, "transactionType": "CREATION"
      };

      this.dashboardService.sendMoneyTransfer(APIXToken, transferObject).subscribe(data => {
        this.loading = false;
        this.router.navigate(['../status'], { relativeTo: this.activatedRoute });
      }, error => {
        this.loading = false;
        this.errMsg = "Failed to process the transaction. " + error.message;
      });

    }

  }

  goBack() {
    this.router.navigate(['../beneficiary'], { relativeTo: this.activatedRoute });
  }

  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
