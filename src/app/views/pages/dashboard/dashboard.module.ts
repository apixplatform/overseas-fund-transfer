// Angular
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';

import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '../../../../../node_modules/@angular/forms';
import { ConversionWidgetComponent } from './conversion-widget/conversion-widget.component';
import { StatusCheckComponent } from './status-check/status-check.component';

@NgModule({
	imports: [
		CommonModule,
		PartialsModule,
		CoreModule,
		MatButtonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild([
			{
				path: '',
				component: DashboardComponent
			},
		]),
	],
	providers: [],
	declarations: [
		DashboardComponent,
		ConversionWidgetComponent,
		StatusCheckComponent,
	]
})
export class DashboardModule {
}
