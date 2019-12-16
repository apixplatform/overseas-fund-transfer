import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RemitOnlineService } from '../../remittance/_services/remit-online/remit-online.service';
import { ApixService } from '../../loan/_services/apix/apix.service';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'kt-conversion-widget',
  templateUrl: './conversion-widget.component.html',
  styleUrls: ['./conversion-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ConversionWidgetComponent implements OnInit, AfterViewInit {

  valid = true;
  formDetails: any;

  loading = false;
  errMsg: string;

  transactionDetails: any;
  accountBasicInfo: any;

  @ViewChild('amountFieldInput', { static: false }) amountFieldInput: ElementRef;

  APIXToken: string;
  convInfo: any;
  convSuccess: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private apixService: ApixService,
    private remitOnlineService: RemitOnlineService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.transactionDetails = JSON.parse(localStorage.getItem("transactionDetails"));
    this.accountBasicInfo = JSON.parse(localStorage.getItem("accountDetails"));

    this.formDetails = this.formBuilder.group({
      trantype: this.transactionDetails ? this.transactionDetails.trantype : 'quick',
      fromcurr: this.transactionDetails ? this.transactionDetails.fromcurr : 'SGD',
      tocurr: this.transactionDetails ? this.transactionDetails.tocurr : 'INR',
      tranamount: this.transactionDetails ? this.transactionDetails.tranamount : ''
    });

    this.apixService.getAPIXToken().subscribe(data => {
      this.APIXToken = data.access_token;

      if (this.APIXToken.includes('Invalid')) {
        console.log('error', 'Invalid Credentials', 'Please check if you have set valid APIX credentials in your API config.');
        this.APIXToken = undefined;
      }

      if (this.APIXToken && this.transactionDetails) {
        this.doConversion(this.transactionDetails.tranamount);
      }
    });
  }

  ngAfterViewInit() {
    fromEvent(this.amountFieldInput.nativeElement, 'input').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      }),
      // if character length greater than 1
      filter(res => res.length >= 1),
      // Time in milliseconds between key events
      debounceTime(1000)
    ).subscribe((text: string) => { // subscription for response
      if (this.formDetails.controls.fromcurr.value !== this.formDetails.controls.tocurr.value) {
        this.doConversion(text);
      }
    });
  }

  doConversion(amount: string) {
    this.loading = true;
    this.cdr.markForCheck();
    let request = {
      corporateid: "MAYBNK",
      timestamp: new Date().toISOString(),
      userid: this.accountBasicInfo.accountId,
      token: "1782843079",
      sendCountry: this.formDetails.controls.fromcurr.value.substring(0, 2) + '-' + this.formDetails.controls.fromcurr.value,
      recvCountry: this.formDetails.controls.tocurr.value.substring(0, 2) + '-' + this.formDetails.controls.tocurr.value,
      amount,
      sendmode: this.formDetails.controls.trantype.value === 'quick' ? 'CIP-FER' : 'CIP-NORMAL'
    }

    this.remitOnlineService.doConversion(this.APIXToken, request).subscribe(data => {
      this.convInfo = data;
      if (this.convInfo.sendAmtErrCode && this.convInfo.sendAmtErrCode !== ' ') {
        this.convSuccess = false;
      } else {
        this.convSuccess = true;
      }
      if (this.convInfo.reason) {
        this.convSuccess = false;
      }
      console.log(this.convInfo);
      this.loading = false;
      this.cdr.markForCheck()
    }, error => {
      this.convInfo = error;
      this.convSuccess = false;
      console.error(this.convInfo);
      this.loading = false;
      this.cdr.markForCheck()
    });
  }

  onSubmit(formData: any) {
    this.loading = true;
    this.cdr.markForCheck();
    this.errMsg = undefined;
    console.log('Received Data', formData);

    if (!this.checkFormValid(formData)) {
      this.valid = false;
      this.loading = false;
      this.cdr.markForCheck();
    } else {
      this.transactionDetails = {
        trantype: formData.trantype,
        fromcurr: formData.fromcurr,
        tocurr: formData.tocurr,
        tranamount: formData.tranamount,
        destamount: this.convInfo.destAmount
      }
      localStorage.setItem('transactionDetails', JSON.stringify(this.transactionDetails));

      this.router.navigate(['/remittance/beneficiary']);
    }
  }

  checkFormValid(formData: any): boolean {
    if (!formData.trantype || !formData.fromcurr || !formData.tocurr || !formData.tranamount) {
      return false;
    } else if (formData.trantype === 'default') {
      return false;
    }
    return true;
  }

  getCurrencyClass(element: string) {
    return this.formDetails.controls[element].value
      ? 'border currency-flag-' + this.formDetails.controls[element].value.toLowerCase()
      : ''
  }

  clearAmount() {
    this.formDetails.controls.tranamount.reset();
    this.clearConvInfo();
  }

  clearConvInfo() {
    this.convInfo = this.convSuccess = undefined;
  }

}