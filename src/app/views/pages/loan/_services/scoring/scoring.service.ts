import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// import * as config from '../../../../../../../api-config.json';
import * as requestBodies from '../_models/scoring/_index';
import { AppConfigService } from '../../../../../core/_config/app-config.service';

@Injectable()
export class ScoringService {

  private config: any = AppConfigService.apiConfig;
  
  commonOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  login(APIXToken?: string): Observable<any> {
    const headers: HttpHeaders = APIXToken
      ? this.commonOptions.headers.append('X-Authorization', 'bearer ' + APIXToken)
      : this.commonOptions.headers;
    const body = JSON.stringify(this.config.scoreApi.credentials);

    console.log(body);

    return this.http.post(this.config.scoreApi.url.loginEndpoint, body, { headers });
  }

  createReq(accessToken: string, msisdn: string, APIXToken?: string): Observable<any> {
    const headers = (APIXToken
      ? this.commonOptions.headers.append('X-Authorization', 'bearer ' + APIXToken)
      : this.commonOptions.headers)
      .append('Authorization', 'Bearer ' + accessToken);

    const body: requestBodies.CreateReqBody = {
      client_code: this.config.scoreApi.clientCode,
      requested_msisdn: msisdn
    };

    return this.http.post(this.config.scoreApi.url.createReqEndpoint, body, { headers });
  }

  verifyReq(accessToken: string, reqId: string, otp: string, APIXToken?: string): Observable<any> {
    const headers = (APIXToken
      ? this.commonOptions.headers.append('X-Authorization', 'bearer ' + APIXToken)
      : this.commonOptions.headers)
      .append('Authorization', 'Bearer ' + accessToken);

    const body: requestBodies.VerifyReqBody = {
      request_id: reqId,
      otp
    };

    let params: HttpParams = new HttpParams();
    params = params.append('request_id', body.request_id).append('otp', body.otp);

    return this.http.get(this.config.scoreApi.url.verifyReqEndpoint, { headers, params });
  }

  getScore(accessToken: string, msisdn: string, consentId: string, APIXToken?: string): Observable<any> {
    const headers = (APIXToken
      ? this.commonOptions.headers.append('X-Authorization', 'bearer ' + APIXToken)
      : this.commonOptions.headers)
      .append('Authorization', 'Bearer ' + accessToken);

    const body: requestBodies.ScoreReqBody = {
      client_code: this.config.scoreApi.clientCode,
      requested_msisdn: msisdn,
      consent_id: consentId
    };

    return this.http.post(this.config.scoreApi.url.scoreReqEndpoint, body, { headers });
  }
}
