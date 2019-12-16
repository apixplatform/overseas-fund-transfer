import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ApixService } from '../../loan/_services/apix/apix.service';
import { RemitOnlineService } from '../../remittance/_services/remit-online/remit-online.service';

@Component({
  selector: 'kt-status-check',
  templateUrl: './status-check.component.html',
  styleUrls: ['./status-check.component.scss']
})
export class StatusCheckComponent implements OnInit {

  @Output() refresh = new EventEmitter<string>();

  recentRemittances: any;
  accountBasicInfo: any;
  APIXToken: any;

  constructor(
    private dashboardService: DashboardService,
    private apixService: ApixService,
    private remitOnlineService: RemitOnlineService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.recentRemittances = JSON.parse(localStorage.getItem('recentRemittances'));
    this.accountBasicInfo = JSON.parse(localStorage.getItem("accountDetails"));

    this.apixService.getAPIXToken().subscribe(data => {
      const APIXToken = data.access_token;

      if (APIXToken.includes('Invalid')) {
        console.log('error', 'Invalid Credentials', 'Please check if you have set valid APIX credentials in your API config.');
      } else {
        this.APIXToken = APIXToken;
      }
    });
  }

  checkStatus(refno: string, index: number) {
    this.recentRemittances[index].status = 'Checking...';
    this.recentRemittances[index].hasrefresh = false;
    const request = {
      corporateid: "MAYBNK",
      timestamp: new Date().toISOString(),
      userid: this.accountBasicInfo.accountId,
      token: "1782843079",
      trnrefnumber: refno
    }

    this.remitOnlineService.checkStatus(this.APIXToken, request).subscribe(data => {
      if (data.status.includes('processing')) {
        this.recentRemittances[index].status = 'Bank Processing';
        this.recentRemittances[index].hasrefresh = true;
      }
      if (data.status.includes('complaince')) {
        this.recentRemittances[index].status = 'Compliance Check';
        this.recentRemittances[index].hasrefresh = true;
      }
      if (data.status.includes('rejected')) {
        this.recentRemittances[index].status = 'Rejected';
        this.recentRemittances[index].hasrefresh = false;
        localStorage.setItem('recentRemittances', JSON.stringify(this.recentRemittances));
      }
      if (data.status.includes('failed')) {
        this.recentRemittances[index].status = 'Failed';
        this.recentRemittances[index].hasrefresh = false;
        localStorage.setItem('recentRemittances', JSON.stringify(this.recentRemittances));
      }
      if (data.status.includes('successful')) {
        this.recentRemittances[index].status = 'Successful';
        this.recentRemittances[index].hasrefresh = false;
        this.reflectTransaction(index);
        localStorage.setItem('recentRemittances', JSON.stringify(this.recentRemittances));
      }
      this.cdr.markForCheck();
    }, error => {
      console.log(error);
      this.recentRemittances[index].status = 'Error';
      this.recentRemittances[index].hasrefresh = true;
    })
  }

  reflectTransaction(index: number) {
    const transferObject = {
      "accountId": this.accountBasicInfo.accountId,
      "balance": 0, "balanceCreditDebitIndicator": "Debit", "balanceType": "ClosingAvailable",
      "bankId": 1001, "bankLocation": "1", "bookingDateTime": "2019-08-16T11:57:47.320Z",
      "currencyCode": "AED", "makerDate": "2019-08-16T11:57:47.320Z", "makerId": "1", "paymentId": 0, "paymentRefId": this.recentRemittances[index].tranrefno,
      "purpose": this.recentRemittances[index].purpose + " - " + this.recentRemittances[index].tranrefno, "status": "Y", "transactionAmount": this.recentRemittances[index].tranamount, "transactionName": "1",
      "transactionReference": this.recentRemittances[index].tranrefno, "transactionType": "CREATION"
    };

    this.dashboardService.sendMoneyTransfer(this.APIXToken, transferObject).subscribe(data => {
      this.refresh.emit(this.accountBasicInfo.accountId);
      this.cdr.markForCheck();
    }, error => {
      console.error(error);
      this.cdr.markForCheck();
    })
  }

}
