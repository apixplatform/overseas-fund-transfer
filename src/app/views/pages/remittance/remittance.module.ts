// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Metronic
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../../core/core.module';

// Core Module
import { BeneficiaryDetailsComponent } from './beneficiary-details/beneficiary-details.component';

import { MatButtonModule } from '@angular/material/button';
import { RemitterDetailsComponent } from './remitter-details/remitter-details.component';
import { TransferStatusComponent } from './transfer-status/transfer-status.component';

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
        path: 'beneficiary',
        component: BeneficiaryDetailsComponent
      },
      {
        path: 'remitter',
        component: RemitterDetailsComponent
      },
      {
        path: 'status',
        component: TransferStatusComponent
      }
    ]),
  ],
  providers: [],
  declarations: [
    BeneficiaryDetailsComponent,
    RemitterDetailsComponent,
    TransferStatusComponent
  ]
})
export class RemittanceModule { }
