import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { ScoringService } from '../_services/scoring/scoring.service';
import { CryptoService } from '../_services/crypto/crypto.service';

@Component({
  selector: 'kt-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {
  accessToken: string;
  requestId: string;
  consentId: string;
  secureMSISDN: string;

  valid = true;
  msisdn: string;
  formDetails: any;
  score: string;
  scoreMult: number;

  loading = false;
  errMsg: string;

  constructor(
    private formBuilder: FormBuilder,
    private scoringService: ScoringService,
    private cryptoService: CryptoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.accessToken = localStorage.getItem('access_token');
    this.requestId = localStorage.getItem('request_id');
    this.secureMSISDN = localStorage.getItem('secureMSISDN');
    this.msisdn = localStorage.getItem('msisdn');
    if (!this.accessToken || !this.requestId || !this.secureMSISDN) {
      this.router.navigate(['/loan']);
    }
    this.formDetails = this.formBuilder.group({
      otp: ''
    });
  }

  onSubmit(formData: any) {
    this.loading = true;
    console.log('Received Data', formData);

    if (!formData.otp) {
      this.valid = false;
    } else {
      this.valid = true;
      this.startVerifyFlow(formData.otp);
    }

    this.formDetails.reset();
  }

  startVerifyFlow(otp: any) {
    this.scoringService.verifyReq(this.accessToken, this.requestId, otp).subscribe(response => {
      if (response.data && response.data.consent_id) {
        this.consentId = response.data.consent_id;
        localStorage.setItem('consentId', this.consentId);

        this.getCreditScore();
      }
    }, error => {
      this.errMsg = 'Error: TrustingSocial: Your OTP was rejected by the TrustingSocial API with the following message: ' + error.error.message;
      console.log(
        'error',
        'Error: TrustingSocial',
        'Your OTP was rejected by the TrustingSocial API with the following message:\n' + error.error.message
      );
      console.error(error);
      this.loading = false;
    });
  }

  getCreditScore() {
    this.scoringService.getScore(this.accessToken, this.secureMSISDN, this.consentId).subscribe(response => {
      if (response.data && response.data.score) {

        this.cryptoService.decrypt(response.data.score).subscribe(decrypted => {
          this.score = decrypted;
          this.loading = false;


          if (parseInt(this.score, 10) < 300) { this.score = '0'; }
          if (parseInt(this.score, 10) > 850) { this.score = '0'; }

          this.scoreMult = ((parseInt(this.score, 10) - 300) / (850 - 300));
          console.log('this.scoreMult', this.scoreMult);
          localStorage.setItem('scoreMult', this.scoreMult.toString());
        });
      }
    }, error => {
      this.errMsg = 'Error: TrustingSocial: The TrustingSocial API could not retrieve a credit score for this number. Check the console for more information.'
      console.log(
        'error',
        'Error: TrustingSocial',
        'The TrustingSocial API could not retrieve a credit score for this number. Check the console for more information.'
      );
      console.error(error);
      this.loading = false;

    });
  }

}
