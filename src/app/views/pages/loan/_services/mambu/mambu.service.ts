import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// import * as config from 'api-config.json';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../../../../core/_config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class MambuService {
  private config: any = AppConfigService.apiConfig;

  constructor(private http: HttpClient) { }

  getBranches(): Observable<any> {
    return this.http.get(this.config.mambu.baseUrl + this.config.mambu.branchesUrl);
  }
}
