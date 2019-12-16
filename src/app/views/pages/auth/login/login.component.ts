// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, AuthService, Login } from '../../../../core/auth';

import { ApixService } from '../../loan/_services/apix/apix.service';
import { SmartBankService } from '../../loan/_services/smart-bank/smart-bank.service';

/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
    EMAIL: '',
    PASSWORD: ''
};

@Component({
    selector: 'kt-login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
    // Public params
    loginForm: FormGroup;
    loading = false;
    isLoggedIn$: Observable<boolean>;
    errors: any = [];

    showErrorMsg = false;

    private unsubscribe: Subject<any>;

    private returnUrl: any;

    // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    /**
     * Component constructor
     *
     * @param router: Router
     * @param auth: AuthService
     * @param authNoticeService: AuthNoticeService
     * @param translate: TranslateService
     * @param store: Store<AppState>
     * @param fb: FormBuilder
     * @param cdr
     * @param route
     */
    constructor(
        private router: Router,
        private auth: AuthService,
        private authNoticeService: AuthNoticeService,
        private translate: TranslateService,
        private store: Store<AppState>,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private smartbankService: SmartBankService,
        private apixService: ApixService
    ) {
        this.unsubscribe = new Subject();
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit(): void {
        let accountDetails = localStorage.getItem('accountDetails');
        if (accountDetails) {
            this.router.navigate(['/dashboard']);
        }
        this.initLoginForm();

        // redirect back to the returnUrl before login
        this.route.queryParams.subscribe(params => {
            this.returnUrl = params.returnUrl || '/';
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this.authNoticeService.setNotice(null);
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.loading = false;
    }

    /**
     * Form initalization
     * Default params, validators
     */
    initLoginForm() {
        // demo message to show
        if (!this.authNoticeService.onNoticeChanged$.getValue()) {
            const initialNotice = `Use account
            <strong>${DEMO_PARAMS.EMAIL}</strong> and password
            <strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
            this.authNoticeService.setNotice(initialNotice, 'info');
        }

        this.loginForm = this.fb.group({
            email: [DEMO_PARAMS.EMAIL, Validators.compose([
                Validators.required,
                Validators.email,
                Validators.minLength(3),
                Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
            ])
            ],
            password: [DEMO_PARAMS.PASSWORD, Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)
            ])
            ]
        });
    }

    /**
     * Form Submit
     */
    submit() {
        const controls = this.loginForm.controls;
        /** check form */
        if (this.loginForm.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            return;
        }

        this.loading = true;

        const authData = {
            email: controls.email.value,
            password: controls.password.value
        };

        this.apixService.getAPIXToken().subscribe(data => {
            const APIXToken = data.access_token;

            if (APIXToken.includes('Invalid')) {
                console.log('error', 'Invalid Credentials', 'Please check if you have set valid APIX credentials in your API config.');
            } else {
                this.smartbankService.login(APIXToken, authData.email, authData.password).subscribe(response => {
                    console.log(response);
                    if (response.statusCode) {
                        this.showErrorMsg = true;
                        this.loading = false;
                    } else {
                        this.saveAccountDetails(APIXToken, response.partyId);
                    }
                });
            }

        });
        // this.auth
        //     .login(authData.email, authData.password)
        //     .pipe(
        //         tap(user => {
        //             if (user) {
        //                 this.store.dispatch(new Login({authToken: user.accessToken}));
        //                 this.router.navigateByUrl(this.returnUrl); // Main page
        //             } else {
        //                 this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
        //             }
        //         }),
        //         takeUntil(this.unsubscribe),
        //         finalize(() => {
        //             this.loading = false;
        //             this.cdr.markForCheck();
        //         })
        //     )
        //     .subscribe();
    }
    saveAccountDetails(APIXToken: string, partyId: string) {
        let accountId, accountName, nickname, accountIdentification;
        this.smartbankService.getAccNo(APIXToken, partyId).subscribe(response => {
            accountId = response[0];

            this.smartbankService.getAccData(APIXToken, accountId).subscribe(accData => {
                accountName = accData.accountName;
                nickname = accData.nickname;
                accountIdentification = accData.accountIdentification;

                if (accountName && nickname && accountIdentification) {
                    let accountDetails = {
                        accountId: accountId,
                        accountIdentification: accountIdentification,
                        partyId: partyId,
                        accountName: accountName,
                        nickname: nickname,
                        schemeName: accData.schemeName,
                        secondaryIdentification:
                            accData.secondaryIdentification,
                        email: this.loginForm.controls.email.value
                    }

                    this.loading = false;

                    localStorage.setItem(
                        'accountDetails',
                        JSON.stringify(accountDetails)
                    );
                    this.router.navigate(['/dashboard']);
                } else {
                    this.showErrorMsg = true;
                    this.loading = false;
                }
            }, error => {
                this.showErrorMsg = true;
                this.loading = false;
            });
        }, error => {
            this.showErrorMsg = true;
            this.loading = false;
        });
    }

    /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to valitors name
     */
    isControlHasError(controlName: string, validationType: string): boolean {
        const control = this.loginForm.controls[controlName];
        if (!control) {
            return false;
        }

        const result = control.hasError(validationType) && (control.dirty || control.touched);
        return result;
    }
}
