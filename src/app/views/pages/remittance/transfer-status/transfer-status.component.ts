import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RemitOnlineService } from '../_services/remit-online/remit-online.service';


@Component({
  selector: 'kt-remittance-status',
  templateUrl: './transfer-status.component.html',
  styleUrls: ['./transfer-status.component.scss']
})
export class TransferStatusComponent implements OnInit {

  remittanceDetails: any;
  transactionDetails: any;
  recentRemittances: Array<any>;

  constructor(
    private formBuilder: FormBuilder,
    private remitOnlineService: RemitOnlineService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.remittanceDetails = JSON.parse(localStorage.getItem('remittanceDetails'));
    this.transactionDetails = JSON.parse(localStorage.getItem('transactionDetails'));
    this.recentRemittances = JSON.parse(localStorage.getItem('recentRemittances'));
  }

  gotoDashboard(){
    localStorage.removeItem('recentRemittances');
    localStorage.removeItem('remittanceDetails');
    localStorage.removeItem('transactionDetails');

    this.transactionDetails.tranrefno = this.remittanceDetails.tranrefno;
    this.transactionDetails.purpose = this.remittanceDetails.purpose;
    if (!this.recentRemittances) {
      this.recentRemittances = new Array<any>();
    }
    this.recentRemittances.unshift(this.transactionDetails);
    this.recentRemittances = this.recentRemittances.slice(0, 3);

    localStorage.setItem('recentRemittances', JSON.stringify(this.recentRemittances));

    this.router.navigate(['/dashboard'], {relativeTo: this.activatedRoute});
  }

}
