import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Location} from "@angular/common";

@Injectable()
export class AppConfigService {
	static apiConfig: any;

	constructor(
		private http: HttpClient,
		private location: Location
	) {
	}

	initializeApp(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.http
				.get(
					this.location.prepareExternalUrl(
						"assets/config/api-config.json"
					)
				)
				.toPromise()
				.then((properties: any) => {
					console.log(properties)
					AppConfigService.apiConfig = properties;
					resolve();
				});
		});
	}
}
