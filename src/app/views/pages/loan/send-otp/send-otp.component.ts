import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ScoringService } from '../_services/scoring/scoring.service';
import { CryptoService } from '../_services/crypto/crypto.service';

@Component({
  selector: 'kt-send-otp',
  templateUrl: './send-otp.component.html',
  styleUrls: ['./send-otp.component.scss']
})
export class SendOtpComponent implements OnInit {
  valid = true;
  formDetails: any;

  loading = false;
  errMsg: string;

  constructor(
    private formBuilder: FormBuilder,
    private scoringService: ScoringService,
    private cryptoService: CryptoService,
    private router: Router
  ) { }

  ngOnInit() {
    let accountDetails: any = JSON.parse(localStorage.getItem('accountDetails'));
    this.formDetails = this.formBuilder.group({
      name: accountDetails ? accountDetails.accountName : '',
      msisdn: ''
    });
  }

  onSubmit(formData: any) {
    this.loading = true;
    console.log('Received Data', formData);

    if (!formData.name || !formData.msisdn) {
      this.valid = false;
    } else {
      this.valid = true;
      this.startOTPFlow(formData.msisdn);
    }

    // this.formDetails.reset();
  }

  startOTPFlow(msisdn: string) {
    let accessToken;
    this.scoringService.login().subscribe(response => {
      if (response.data && response.data.access_token) {
        accessToken = response.data.access_token;
        localStorage.setItem('access_token', response.data.access_token);

        this.sendOTP(accessToken, msisdn);
      }
    }, error => {
      this.errMsg = 'Invalid Credentials: Please check if you have set valid TrustingSocial credentials in your API config.';
      console.log(
        'error',
        'Invalid Credentials',
        'Please check if you have set valid TrustingSocial credentials in your API config.'
      );
      console.error(error);
      this.loading = false;
    });
  }

  sendOTP(accessToken: string, msisdn: string) {
    this.cryptoService.encrypt(msisdn).subscribe(secureMSISDN => {
      console.log('secureMSISDN', secureMSISDN);

      localStorage.setItem('secureMSISDN', secureMSISDN);
      localStorage.setItem('msisdn', msisdn);
      this.scoringService.createReq(accessToken, secureMSISDN).subscribe(response => {
        this.loading = false;
        if (response.data && response.data.request_id) {
          localStorage.setItem('request_id', response.data.request_id);
          this.router.navigate(['/loan/verify']);
        }
      }, error => {
        this.errMsg = 'Error: TrustingSocial: Your request was rejected by the TrustingSocial API with the following message: ' + error.error.message;
        console.log(
          'error',
          'Error: TrustingSocial',
          'Your request was rejected by the TrustingSocial API with the following message:\n' + error.error.message
        );
        console.error(error);
        this.loading = false;
      });
    });
  }

}
