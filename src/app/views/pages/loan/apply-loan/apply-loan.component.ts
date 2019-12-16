import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ApixService } from '../_services/apix/apix.service';
import { SmartBankService } from '../_services/smart-bank/smart-bank.service';


@Component({
  selector: 'kt-apply-loan',
  templateUrl: './apply-loan.component.html',
  styleUrls: ['./apply-loan.component.scss']
})
export class ApplyLoanComponent implements OnInit {
  loading = false;
  formDetails: any;
  valid = true;
  loanId: string;
  amt: string;
  maxAmt = 15000;
  scoreMult: number;
  accountId: string;
  errMsg: string;

  constructor(
    private smartBankService: SmartBankService,
    private apixService: ApixService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.scoreMult = parseFloat(localStorage.getItem('scoreMult'));
    this.accountId = JSON.parse(localStorage.getItem('accountDetails')).accountId;
    if (!this.scoreMult || !this.accountId) {
      this.router.navigate(['/loan']);
    }
    this.formDetails = this.formBuilder.group({
      amt: ''
    });
    console.log(this.formDetails);
  }

  onSubmit(formData: any) {
    console.log('Received Data', formData);

    if (!formData.amt) {
      this.valid = false;
    } else {
      this.valid = true;
      this.amt = formData.amt;
    }

    this.formDetails.reset();
  }

  getLoamAmt(){
    return this.round(Math.min(parseInt(this.amt, 10),this.maxAmt) * this.scoreMult, 2);
  }

  applyLoan() {
    this.loading = true;
    const accountId = JSON.parse(localStorage.getItem('accountDetails')).accountId;
    this.apixService.getAPIXToken().subscribe(data => {
      const APIXToken = data.access_token;

      if (APIXToken.includes('Invalid')) {
        this.loading = false;
        this.errMsg = 'Invalid Credentials. Please check if you have set valid APIX credentials in your API config.';
        console.log('error', 'Invalid Credentials', 'Please check if you have set valid APIX credentials in your API config.');
      } else {
        const loanAmt = this.getLoamAmt()

        this.smartBankService.applyLoan(APIXToken, accountId, loanAmt).subscribe(response => {
          this.loading = false;
          this.loanId = response.loanId;
          localStorage.removeItem('request_id');
          localStorage.removeItem('msisdn');
          localStorage.removeItem('request_id');
          localStorage.removeItem('scoreMult');
          localStorage.removeItem('consentid');
          localStorage.removeItem('access_token');
          localStorage.removeItem('secureMSISDN');
        }, error => {
          this.errMsg = 'Error: SmartBank: The SmartBank API rejected your loan request. Check the console for more information.';
          console.log(
            'error',
            'Error: SmartBank',
            'The SmartBank API rejected your loan request. Check the console for more information.'
          );
          console.error(error);
          this.loading = false;
        });
      }
    });
  }

  round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}
