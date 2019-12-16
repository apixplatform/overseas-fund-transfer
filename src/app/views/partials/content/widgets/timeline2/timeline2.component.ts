// Angular
import { Component, Input, OnInit } from '@angular/core';

export interface Timeline2Data {
	time: string;
	text: string;
	icon?: string;
	attachment?: string;
}

@Component({
	selector: 'kt-timeline2',
	templateUrl: './timeline2.component.html',
	styleUrls: ['./timeline2.component.scss']
})
export class Timeline2Component implements OnInit {
	// Public properties
	@Input() data: Timeline2Data[];

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		if (!this.data) {
			this.data = [
				{
					time: new Date().getDate() + '/' + (new Date().getMonth()+1),
					icon: 'fa fa-genderless kt-font-info',
					text: 'Don\'t forget to apply your credit card. Check Cards section for more info.',
				},
				// {
				// 	time: '12:45',
				// 	icon: 'fa fa-genderless kt-font-success',
				// 	text: 'AEOL Meeting With',
				// 	attachment: '\n' +
				// 		'<a href="$event.preventDefault();"><img src="./assets/media/users/100_4.jpg" title="" alt=""></a>' +
				// 		'<a href="$event.preventDefault();"><img src="./assets/media/users/100_13.jpg" title="" alt=""></a>' +
				// 		'<a href="$event.preventDefault();"><img src="./assets/media/users/100_11.jpg" title="" alt=""></a>' +
				// 		'<a href="$event.preventDefault();"><img src="./assets/media/users/100_14.jpg" title="" alt=""></a>'
				// },
				{
					time: new Date().getDate() + '/' + (new Date().getMonth()+1),
					icon: 'fa fa-genderless kt-font-info',
					text: 'You are eligible for a loan up to <a href="$event.preventDefault();" class="kt-link kt-link--brand kt-font-bolder">SGD 15000</a>. Check Loans section for more info.',
				},
				{
					time: new Date().getDate() + '/' + (new Date().getMonth()+1),
					icon: 'fa fa-genderless kt-font-success',
					text: 'Received <a href="$event.preventDefault();" class="kt-link kt-link--brand kt-font-bolder">SGD 10000</a> - Salary Credit',
				},
				// {
				// 	time: '16:00',
				// 	icon: 'fa fa-genderless kt-font-brand',
				// 	text: 'Lorem ipsum dolor sit amit,consectetur eiusmdd tempor<br>' +
				// 		'incididunt ut labore et dolore magna elit enim at minim<br>' +
				// 		'veniam quis nostrud',
				// },
				// {
				// 	time: '17:00',
				// 	icon: 'fa fa-genderless kt-font-danger',
				// 	text: 'Received a new feedback on <a href="$event.preventDefault();" class="kt-link kt-link--brand kt-font-bolder">FinancePro App</a> product.',
				// },
			];
		}
	}
}
