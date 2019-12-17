// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Metronic
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../../core/core.module';

import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PartialsModule,
    CoreModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
  ],
  providers: [],
  declarations: []
})
export class LoanModule { }
