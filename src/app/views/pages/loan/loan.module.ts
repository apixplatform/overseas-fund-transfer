// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Metronic
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../../core/core.module';

// Core Module
import { SendOtpComponent } from './send-otp/send-otp.component';
import { CryptoService } from './_services/crypto/crypto.service';
import { ScoringService } from './_services/scoring/scoring.service';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';

import {MatButtonModule} from '@angular/material/button';
import { ApplyLoanComponent } from './apply-loan/apply-loan.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PartialsModule,
    CoreModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SendOtpComponent
      },
      {
        path: 'verify',
        component: VerifyOtpComponent
      },
      {
        path: 'apply',
        component: ApplyLoanComponent
      },
    ]),
  ],
  providers: [CryptoService, ScoringService],
  declarations: [
    SendOtpComponent,
    VerifyOtpComponent,
    ApplyLoanComponent
  ]
})
export class LoanModule { }
