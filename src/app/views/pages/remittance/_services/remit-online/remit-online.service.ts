import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// import * as hardcoded from '../../../../../../../api-config.json';
import { AppConfigService } from '../../../../../core/_config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RemitOnlineService {

  private config: any = AppConfigService.apiConfig;

  constructor(private http: HttpClient) { }

  addTransaction(APIXToken: string, request: any): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('X-Authorization', 'bearer ' + APIXToken);
    headers = headers.append('username', this.config.remitOnline.credentials.username);
    headers = headers.append('password', this.config.remitOnline.credentials.password);
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'text/plain; charset=utf-8');

    return this.http.post(this.config.remitOnline.addTransactionUrl, request, { headers });
  }

  doConversion(APIXToken: string, request: any): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('X-Authorization', 'bearer ' + APIXToken);
    headers = headers.append('username', this.config.remitOnline.credentials.username);
    headers = headers.append('password', this.config.remitOnline.credentials.password);
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'text/plain; charset=utf-8');

    return this.http.post(this.config.remitOnline.getRateUrl, request, { headers });
  }

  checkStatus(APIXToken: string, request: any): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('X-Authorization', 'bearer ' + APIXToken);
    headers = headers.append('username', this.config.remitOnline.credentials.username);
    headers = headers.append('password', this.config.remitOnline.credentials.password);
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'text/plain; charset=utf-8');

    return this.http.post(this.config.remitOnline.statusCheckUrl, request, { headers });
  }

}
