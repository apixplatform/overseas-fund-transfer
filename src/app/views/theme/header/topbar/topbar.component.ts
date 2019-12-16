// Angular
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
	selector: 'kt-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
	isLoggedIn: boolean;
	showLogout = false;
	nickname: string;

	constructor(private router: Router) {}

	ngOnInit() {
		let accountDetails = JSON.parse(localStorage.getItem('accountDetails'));
		if (accountDetails) {
			this.isLoggedIn = true;
			this.nickname = accountDetails.nickname;
		} else {
			this.isLoggedIn = false;
			this.router.navigate(['/auth/login']);
		}
	}

	logout() {
		localStorage.clear();
		this.router.navigate(['/auth/login']);
	}
}
