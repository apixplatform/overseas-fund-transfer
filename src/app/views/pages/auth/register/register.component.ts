// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { finalize, takeUntil, tap, map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, AuthService, Register, User } from '../../../../core/auth/';
import { Subject, fromEvent } from 'rxjs';
import { ConfirmPasswordValidator } from './confirm-password.validator';

import { ApixService } from "../../loan/_services/apix/apix.service";
import { SmartBankService } from '../../loan/_services/smart-bank/smart-bank.service';
import { EmailVerificationService } from "../../loan/_services/email-verification/email-verification.service";

@Component({
	selector: 'kt-register',
	templateUrl: './register.component.html',
	encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit, OnDestroy, AfterViewInit {
	registerForm: FormGroup;
	loading = false;
	errors: any = [];

	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	@ViewChild('emailFieldInput', { static: false }) emailFieldInput: ElementRef;
	validEmail: boolean;
	invalidEmail: boolean;
	APIXToken: any;
	emailValidated: any;
	emailBlacklisted: boolean;
	showErrorMsg: boolean;
	accountCreationSuccess: boolean = false;

	/**
	 * Component constructor
	 *
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param router: Router
	 * @param auth: AuthService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 */
	constructor(
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private router: Router,
		private auth: AuthService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,

		private apixService: ApixService,
		private smartbankService: SmartBankService,
		private emailVerificationService: EmailVerificationService
	) {
		this.unsubscribe = new Subject();
	}

	/*
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
    */

	/**
	 * On init
	 */
	ngOnInit() {
		this.initRegisterForm();
		this.validEmail = false;
		this.invalidEmail = false;
		this.apixService.getAPIXToken().subscribe(data => {
			this.APIXToken = data.access_token;
			if (this.APIXToken.includes('Invalid')) {
				console.log(
					'Please check if you have set valid APIX credentials in your API config.'
				);
			}
		});
	}

	ngAfterViewInit() {
		fromEvent(this.emailFieldInput.nativeElement, 'keyup')
			.pipe(
				// get value
				map((event: any) => {
					return event.target.value;
				}),
				// if character length greater than 2
				filter(res => res.length > 2),
				// Time in milliseconds between key events
				debounceTime(1000),
				// If previous query is different from current
				distinctUntilChanged()
			)
			// subscription for response
			.subscribe((text: string) => {
				this.onEmailValueChange(text);
			});
	}

	/*
    * On destroy
    */
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initRegisterForm() {
		this.registerForm = this.fb.group({
			fullname: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			],
			email: ['', Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				// https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
				Validators.maxLength(320)
			]),
			],
			password: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			],
			confirmPassword: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			],
			agree: [false, Validators.compose([Validators.required])]
		}, {
			validator: ConfirmPasswordValidator.MatchPassword
		});
	}

	onEmailValueChange(emailValue: string): void {
		console.log('Email validating');
		this.smartbankService
			.verifyEmail(this.APIXToken, emailValue)
			.subscribe(data => {
				if (data === true) {
					this.emailVerificationService
						.validateEmailWithIcf(this.APIXToken, emailValue)
						.subscribe(verifiedData => {
							if (
								verifiedData.objects === undefined ||
								verifiedData.objects.length === 0
							) {
								this.emailValidated = data;
								this.validEmail = true;
								this.invalidEmail = false;
								this.emailBlacklisted = false;
								console.log('emailValid', this.validEmail);
							} else {
								verifiedData.objects.forEach(element => {
									console.log(element);
									if (element.x_security_category === 'blacklist') {
										this.emailBlacklisted = true;
										this.validEmail = false;
										this.invalidEmail = false;
									} else {
										this.validEmail = true;
										this.invalidEmail = false;
										this.emailBlacklisted = false;
									}
								});
							}
						});
				} else {
					this.invalidEmail = true;
					this.validEmail = false;
					this.emailBlacklisted = false;
					console.log('email entered is not valid');
				}
			});
	}

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.registerForm.controls;

		// check form
		if (this.registerForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		if (!controls['agree'].value) {
			// you must agree the terms and condition
			// checkbox cannot work inside mat-form-field https://github.com/angular/material2/issues/7891
			this.authNoticeService.setNotice('You must agree to the terms and conditions', 'danger');
			this.loading = false;
			return;
		}

		this.smartbankService
			.createAccount(
				this.APIXToken,
				controls.fullname.value,
				controls.fullname.value.split(' ')[0],
				'BBAN',
				'Y'
			)
			.subscribe(accountData => {
				let account = JSON.parse(JSON.stringify(accountData));

				if (accountData != null) {
					this.smartbankService
						.createParty(this.APIXToken, controls.fullname.value)
						.subscribe(
							partyData => {
								const partyId = partyData.partyId;
								const accountId = accountData.accountId;

								this.smartbankService
									.createUserLogin(
										this.APIXToken,
										partyId,
										controls.email.value,
										controls.password.value,
										controls.fullname.value.split(' ')[0],
										controls.fullname.value
									)
									.subscribe(loginData => {
										console.log('login', loginData);

										this.smartbankService
											.setOwner(this.APIXToken, accountId, partyId)
											.subscribe(
												response => {
													const partyDetails = response.party;

													let accountDetails = {
														accountId: account.accountId,
														accountIdentification: account.accountIdentification,
														partyId: partyDetails.partyId,
														accountName: accountData.accountName,
														nickname: accountData.nickname,
														schemeName: accountData.schemeName,
														secondaryIdentification:
															accountData.secondaryIdentification,
														email: controls.email.value
													};

													localStorage.setItem(
														'accountDetails',
														JSON.stringify(accountDetails)
													);


													this.smartbankService.giftMoney(this.APIXToken, account.accountId, 10000).subscribe(data => {
														this.loading = false;
														this.accountCreationSuccess = true;
													}, error => this.throwSmartBankError(error))


												},
												error => this.throwSmartBankError(error)
											);
									});
							},
							error => this.throwSmartBankError(error)
						);

					console.log(accountData);
				} else {
					this.showErrorMsg = true;
				}
			});

		// const _user: User = new User();
		// _user.clear();
		// _user.email = controls['email'].value;
		// _user.username = controls['username'].value;
		// _user.fullname = controls['fullname'].value;
		// _user.password = controls['password'].value;
		// _user.roles = [];
		// this.auth.register(_user).pipe(
		// 	tap(user => {
		// 		if (user) {
		// 			this.store.dispatch(new Register({authToken: user.accessToken}));
		// 			// pass notice message to the login page
		// 			this.authNoticeService.setNotice(this.translate.instant('AUTH.REGISTER.SUCCESS'), 'success');
		// 			this.router.navigateByUrl('/auth/login');
		// 		} else {
		// 			this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
		// 		}
		// 	}),
		// 	takeUntil(this.unsubscribe),
		// 	finalize(() => {
		// 		this.loading = false;
		// 		this.cdr.markForCheck();
		// 	})
		// ).subscribe();
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.registerForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

	throwSmartBankError(error: any): void {
		console.error(error);
		this.showErrorMsg = true;
		this.loading = false;
	}
}
