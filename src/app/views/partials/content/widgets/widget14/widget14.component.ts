// Angular
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// Charts
import { Chart } from 'chart.js/dist/Chart.min.js';

@Component({
	selector: 'kt-widget14',
	templateUrl: './widget14.component.html',
	styleUrls: ['./widget14.component.scss'],
})
export class Widget14Component implements OnInit {
	// Public properties
	@Input() title: string;
	@Input() desc: string;
	@Input() data: { labels: string[]; datasets: any[] };
	@ViewChild('chart', {static: true}) chart: ElementRef;

	chartRef: any;

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		if (!this.data) {
			this.data = {
				labels: ['4-Nov-19', '5-Nov-19', '6-Nov-19', '7-Nov-19', '8-Nov-19', '9-Nov-19', '10-Nov-19'],
				datasets: [
					{
						label: 'Transaction Amount',
						backgroundColor: this.layoutConfigService.getConfig('colors.state.success'),
						data: [
							15, 20, 25, 30, 25, 20, 15
						]
					}, {
						label: 'Balance',
						backgroundColor: '#f3f3fb',
						data: [
							15, 20, 25, 30, 25, 20, 15
						]
					}
				]
			};
		}

		// this.initChartJS();
	}

	loadBalanceGraph(balanceChartData: any) {
		this.data = balanceChartData;

		this.initChartJS();		
	}

	/** Init chart */
	initChartJS() {
		// For more information about the chartjs, visit this link
		// https://www.chartjs.org/docs/latest/getting-started/usage.html

		if (this.chartRef) {
			this.chartRef.destroy();
		}

		this.chartRef = new Chart(this.chart.nativeElement, {
			type: 'bar',
			data: this.data,
			options: {
				barValueSpacing: 20,
				title: {
					display: false,
				},
				tooltips: {
					intersect: false,
					mode: 'nearest',
					xPadding: 10,
					yPadding: 10,
					caretPadding: 10
				},
				legend: {
					display: true
				},
				responsive: true,
				maintainAspectRatio: false,
				barRadius: 3,
				scales: {
					xAxes: [{
						display: false,
						gridLines: false,
						stacked: false
					}],
					yAxes: [{
						display: false,
						stacked: false,
						gridLines: false
					}]
				},
				layout: {
					padding: {
						left: 0,
						right: 0,
						top: 0,
						bottom: 0
					}
				}
			}
		});
	}
}
