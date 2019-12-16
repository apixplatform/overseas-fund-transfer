import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../../core/_config/app-config.service';

// import * as hardcoded from '../../../../../api-config.json';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private config: any = AppConfigService.apiConfig;

  constructor(private http:HttpClient) { }

  fetchAccountBasicInfo(APIXToken: string, accountId: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders().set('X-Authorization', 'bearer ' + APIXToken);
    return this.http.get(this.config.dashboard.accountBasicInfoUrl, { headers });
  }

  fetchAccountBalance(APIXToken: string, accountId: string): Observable<any>{
    const headers: HttpHeaders = new HttpHeaders().set('X-Authorization', 'bearer ' + APIXToken);
    return this.http.get(`${this.config.dashboard.accountBalanceInfoUrl}/${accountId}`, { headers });
  }

  fetchTransactions(APIXToken: string, accountId: string, page: number, size: number): Observable<any>{
    const headers: HttpHeaders = new HttpHeaders().set('X-Authorization', 'bearer ' + APIXToken);

    let params = {
      page: page.toString(),
      size: size.toString()
    }

    return this.http.get(`${this.config.dashboard.accountTransactionsUrl}/${accountId}`, { headers, params });
  }

  sendMoneyTransfer(APIXToken: string, payload: any): Observable<any>{
    const headers: HttpHeaders = new HttpHeaders().set('X-Authorization', 'bearer ' + APIXToken);
    return this.http.post(`${this.config.dashboard.transferTransactionsUrl}`, payload,{ headers });
  }
}
