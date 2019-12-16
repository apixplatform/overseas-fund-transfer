// Angular
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions } from '../../../core/_base/layout';
import { Widget4Data } from '../../partials/content/widgets/widget4/widget4.component';
import { DashboardService } from './dashboard.service';
import { ApixService } from './../loan/_services/apix/apix.service';
import { DataTableComponent } from '../../partials/content/widgets/general/data-table/data-table.component';
import { Widget14Component } from '../../partials/content/widgets/widget14/widget14.component';
import { MambuService } from '../loan/_services/mambu/mambu.service';


@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
	chartOptions1: SparklineChartOptions;
	chartOptions2: SparklineChartOptions;
	chartOptions3: SparklineChartOptions;
	chartOptions4: SparklineChartOptions;
	widget4_1: Widget4Data;
	widget4_2: Widget4Data;
	widget4_3: Widget4Data;
	widget4_4: Widget4Data;
	widget4_5: Widget4Data;
	widget4_6: Widget4Data;

	accountBasicInfo: any;
	accountBalance: any;
	apixToken: any;
	userId: any;
	transactions: any;

	dashboardForm: any;
	onSuccessTransfer: boolean | any;
	loadingTransfer: any;

	balanceChartData: { labels: string[]; datasets: any[] };
	balanceChartDataReady: boolean = false;

	date: Date = new Date();
	dateString: string = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear();

	creditCardApplyWarning: Boolean = false;

	@ViewChild('transactionTable', {static: false}) transactionTable: DataTableComponent;
	@ViewChild('widgetComp', {static: false}) widgetComp: Widget14Component;

	constructor(
		private layoutConfigService: LayoutConfigService,
		private dashboardService: DashboardService,
		private mambuService: MambuService,
		private apixService: ApixService,
		private cdr: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.onSuccessTransfer = undefined;
		this.dashboardForm = {};
		this.dashboardForm['moneyTransfer'] = {
			from: '',
			to: '',
			amount: ''
		};
		this.userId = localStorage.getItem("user_id");
		this.accountBasicInfo = JSON.parse(localStorage.getItem("accountDetails"));
		this.dashboardForm['moneyTransfer'].from = this.accountBasicInfo.accountId;
		this.getApixToken();


		this.chartOptions1 = {
			data: [10, 14, 18, 11, 9, 12, 14, 17, 18, 14],
			color: this.layoutConfigService.getConfig('colors.state.brand'),
			border: 3
		};
		this.chartOptions2 = {
			data: [11, 12, 18, 13, 11, 12, 15, 13, 19, 15],
			color: this.layoutConfigService.getConfig('colors.state.danger'),
			border: 3
		};
		this.chartOptions3 = {
			data: [12, 12, 18, 11, 15, 12, 13, 16, 11, 18],
			color: this.layoutConfigService.getConfig('colors.state.success'),
			border: 3
		};
		this.chartOptions4 = {
			data: [11, 9, 13, 18, 13, 15, 14, 13, 18, 15],
			color: this.layoutConfigService.getConfig('colors.state.primary'),
			border: 3
		};

		// @ts-ignore
		this.widget4_1 = shuffle([
			{
				pic: './assets/media/files/doc.svg',
				title: 'Metronic Documentation',
				url: 'https://keenthemes.com.my/metronic',
			}, {
				pic: './assets/media/files/jpg.svg',
				title: 'Project Launch Evgent',
				url: 'https://keenthemes.com.my/metronic',
			}, {
				pic: './assets/media/files/pdf.svg',
				title: 'Full Developer Manual For 4.7',
				url: 'https://keenthemes.com.my/metronic',
			}, {
				pic: './assets/media/files/javascript.svg',
				title: 'Make JS Development',
				url: 'https://keenthemes.com.my/metronic',
			}, {
				pic: './assets/media/files/zip.svg',
				title: 'Download Ziped version OF 5.0',
				url: 'https://keenthemes.com.my/metronic',
			}, {
				pic: './assets/media/files/pdf.svg',
				title: 'Finance Report 2016/2017',
				url: 'https://keenthemes.com.my/metronic',
			},
		]);
		// @ts-ignore
		this.widget4_2 = shuffle([
			
		]);
		// @ts-ignore
		this.widget4_3 = shuffle([
			{
				icon: 'flaticon-pie-chart-1 kt-font-info',
				title: 'Metronic v6 has been arrived!',
				url: 'https://keenthemes.com.my/metronic',
				value: '+$500',
				valueColor: 'kt-font-info'
			}, {
				icon: 'flaticon-safe-shield-protection kt-font-success',
				title: 'Metronic community meet-up 2019 in Rome.',
				url: 'https://keenthemes.com.my/metronic',
				value: '+$1260',
				valueColor: 'kt-font-success'
			}, {
				icon: 'flaticon2-line-chart kt-font-danger',
				title: 'Metronic Angular 8 version will be landing soon..',
				url: 'https://keenthemes.com.my/metronic',
				value: '+$1080',
				valueColor: 'kt-font-danger'
			}, {
				icon: 'flaticon2-pie-chart-1 kt-font-primary',
				title: 'ale! Purchase Metronic at 70% off for limited time',
				url: 'https://keenthemes.com.my/metronic',
				value: '70% Off!',
				valueColor: 'kt-font-primary'
			}, {
				icon: 'flaticon2-rocket kt-font-brand',
				title: 'Metronic VueJS version is in progress. Stay tuned!',
				url: 'https://keenthemes.com.my/metronic',
				value: '+134',
				valueColor: 'kt-font-brand'
			}, {
				icon: 'flaticon2-notification kt-font-warning',
				title: 'Black Friday! Purchase Metronic at ever lowest 90% off for limited time',
				url: 'https://keenthemes.com.my/metronic',
				value: '70% Off!',
				valueColor: 'kt-font-warning'
			}, {
				icon: 'flaticon2-file kt-font-focus',
				title: 'Metronic React version is in progress.',
				url: 'https://keenthemes.com.my/metronic',
				value: '+13%',
				valueColor: 'kt-font-focus'
			},
		]);
		// @ts-ignore
		this.widget4_4 = shuffle([
			{
				pic: './assets/media/client-logos/logo5.png',
				title: 'Trump Themes',
				desc: 'Make Metronic Development',
				url: 'https://keenthemes.com.my/metronic',
				value: '+$2500',
				valueColor: 'kt-font-brand'
			}, {
				pic: './assets/media/client-logos/logo4.png',
				title: 'StarBucks',
				desc: 'Good Coffee & Snacks',
				url: 'https://keenthemes.com.my/metronic',
				value: '-$290',
				valueColor: 'kt-font-brand'
			}, {
				pic: './assets/media/client-logos/logo3.png',
				title: 'Phyton',
				desc: 'A Programming Language',
				url: 'https://keenthemes.com.my/metronic',
				value: '+$17',
				valueColor: 'kt-font-brand'
			}, {
				pic: './assets/media/client-logos/logo2.png',
				title: 'GreenMakers',
				desc: 'Make Green Development',
				url: 'https://keenthemes.com.my/metronic',
				value: '-$2.50',
				valueColor: 'kt-font-brand'
			}, {
				pic: './assets/media/client-logos/logo1.png',
				title: 'FlyThemes',
				desc: 'A Let\'s Fly Fast Again Language',
				url: 'https://keenthemes.com.my/metronic',
				value: '+200',
				valueColor: 'kt-font-brand'
			},
		]);

		// @ts-ignore
		this.widget4_5 = shuffle([
			{
				pic: './assets/media/files/pdf.svg',
				title: 'Statement - Month of Nov 2019 (Partial)',
				url: '',
			}
		]);

		// @ts-ignore
		this.widget4_6 = shuffle([
			{
				icon: '',
				title: 'Current Balance',
				url: '',
				value: '$15,000.00',
				valueColor: 'kt-font-info'
			}, {
				icon: '',
				title: 'Available Balance',
				url: '',
				value: '$14,000.00',
				valueColor: 'kt-font-info'
			}, {
				icon: '',
				title: 'Arranged Overdraft',
				url: '',
				value: '$60.00',
				valueColor: 'kt-font-info'
			},
		]);
	}

	fetchAccountBasicInfo(id) {
		this.dashboardService.fetchAccountBasicInfo(this.apixToken, id).subscribe((resp) => {
			console.log(resp);
			this.accountBasicInfo = resp;
		}, (error) => {
			console.error(error);
		});
	}

	fetchAccountBalance(accountId) {
		this.dashboardService.fetchAccountBalance(this.apixToken, this.accountBasicInfo.accountIdentification).subscribe((resp) => {
			console.log(resp);
			this.accountBalance = resp;
			this.cdr.markForCheck();
			this.fetchTransactions(accountId, 0);
		}, (error) => {
			console.error(error);
		});
	}

	fetchTransactions(accountId: string, pageNo: number) {
		this.dashboardService.fetchTransactions(this.apixToken, accountId, pageNo, 100).subscribe(data => {
			console.log('transactions', data);
			if (data.length === 100) {
				this.fetchTransactions(accountId, pageNo + 1);
			}
			this.transactions = data;
			this.transactionTable.parseTransactions(this.transactions);
			if (data.length >= 0) {
				
				this.cdr.markForCheck();

				this.transactions = this.transactions.reverse().splice(0, 15);

				this.balanceChartDataReady = false;
				this.balanceChartData = {
					labels: [],
					datasets: [{
						label: 'Transaction Amount',
						backgroundColor: this.layoutConfigService.getConfig('colors.state.warning'),
						data: [

						]
					}, {
						label: 'Balance',
						backgroundColor: this.layoutConfigService.getConfig('colors.state.success'),
						data: [

						]
					}]
				}

				this.transactions.forEach(transaction => {
					this.balanceChartData.labels.push(new Date(transaction.expectedDisbursementDate).toISOString().split('T')[0]);
					var transactionAmount = transaction.balanceCreditDebitIndicator != 'Credit' ? transaction.transactionAmount * -1 : transaction.transactionAmount
					this.balanceChartData.datasets[1].data.unshift(transaction.balance);
					this.balanceChartData.datasets[0].data.unshift(transactionAmount);
				});
				console.log('balanceChartData:');
				console.log(this.balanceChartData);

				this.widgetComp.loadBalanceGraph(this.balanceChartData);

				this.balanceChartDataReady = true;
			} 
		})
	}

	getApixToken() {
		this.apixService.getAPIXToken().subscribe((resp) => {
			this.apixToken = resp.access_token;
			console.log(resp);
			// call data services

			// this.fetchAccountBasicInfo(this.userId);
			this.fetchAccountBalance(this.accountBasicInfo.accountId);
			this.getBranches();
		}, (error) => {
			console.error(error);
		});
	}

	getBranches(){
		this.mambuService.getBranches().subscribe(branches => {
			var branchView = [];
			branches.forEach(branch => {
				branchView.push({
					pic: './assets/media/client-logos/logo1.png',
					username: branch.name,
					desc: branch.id,
					url: '',
					buttonClass: 'btn-label-brand'
				})
			});

			// @ts-ignore
			this.widget4_2 = shuffle(branchView);
		}, (error) => {
			console.error(error);
		})
	}

	makeTransfer() {
		this.loadingTransfer = true;
		this.onSuccessTransfer = undefined;
		const transferObject = {
			"accountId": this.dashboardForm['moneyTransfer'].from,
			"balance": 0, "balanceCreditDebitIndicator": "Debit", "balanceType": "ClosingAvailable",
			"bankId": 1001, "bankLocation": "1", "bookingDateTime": "2019-08-16T11:57:47.320Z",
			"counterPartyAccountId": this.dashboardForm['moneyTransfer'].to, "counterPartyBankId": 1002,
			"counterPartyBankLocation": "1", "currencyCode": "AED", "makerDate":
				"2019-08-16T11:57:47.320Z", "makerId": "1", "paymentId": 0, "paymentRefId": "1",
			"purpose": this.dashboardForm['moneyTransfer'].from + " - Transfer", "status": "Y", "transactionAmount": this.dashboardForm['moneyTransfer'].amount, "transactionName": "1",
			"transactionReference": "Transfer_Adjustment 1000000001", "transactionType": "CREATION"
		};
		this.dashboardService.sendMoneyTransfer(this.apixToken, transferObject).subscribe((resp) => {
			console.log(resp);
			this.onSuccessTransfer = true;
			setTimeout(()=> {
				this.onSuccessTransfer = undefined;
			}, 5000)
			this.loadingTransfer = false;
			this.fetchAccountBalance(this.accountBasicInfo.accountId);
		}, (error) => {
			console.error(error);
			this.loadingTransfer = false;
			this.onSuccessTransfer = false;
			setTimeout(()=> {
				this.onSuccessTransfer = undefined;
			}, 5000);
		});
	}

	clearTransferForm() {
		this.dashboardForm['moneyTransfer'] = {
			from: '',
			to: '',
			amount: ''
		};
	}

	applyCreditCard(){
		this.creditCardApplyWarning = true;
	}
}
