import {Injectable, Component} from '@angular/core';
import {Http} from '@angular/http';
import {AppConfig} from '../shared/index';

import 'rxjs/add/operator/toPromise';

@Injectable()
@Component({
  providers: [AppConfig]
})
export class DocsService {

  constructor(
    private _http: Http,
    private _appConfig: AppConfig
  ) {}

  getDocs() {
    return this._http.get(this._appConfig.hostApi + '/documentation.php')
               .toPromise()
               .then(response => response)
               .catch(error => Promise.reject(error.message || error));
  }
}
