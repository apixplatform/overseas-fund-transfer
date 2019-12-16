import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../../../../core/_config/app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {
  private config: any = AppConfigService.apiConfig;

  constructor(private http: HttpClient) {}

  validateEmailWithIcf(APIXToken: string, email: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders()
      .set('X-Authorization', 'bearer ' + APIXToken)
      .set('X-Api-Key', this.config.icf.x_api_key);

    const request = {
      type: 'single',
      params: {
        x_pattern_value: email
      }
    };

    return this.http.post(this.config.icf.url, request, {
      headers
    });
  }
}
