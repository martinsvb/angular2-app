import { Injectable, Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { AppConfig } from '../appConfig/index';
import { CacheComponent } from '../cache/cache.component';

@Injectable()
@Component({
    providers: [AppConfig]
})
export class AppRequest {
    
    user: any;

    private _headers = new Headers({
        'accept': '*/*',
        'content-Type': 'application/json'
    });
    
    private _options = new RequestOptions({ headers: this._headers });

    constructor(
        private _http: Http,
        private _appConfig: AppConfig,
        private _cache: CacheComponent
    ) {
        this.user = this._cache.getItem('user');
        
        this._cache.dataAdded$.subscribe((data: any) => {
            if (data.hasOwnProperty('user')) {
                this.user = data['user'];
            }
        });
    }

    /**
     *  Retrieve data from API
     */
    getAction (url: string): Observable<any[]> {
        
        return this._http.get(`${this._appConfig.hostApi}${url}/user/${this.user.email}`)
                    .map(this._extractData)
                    .catch(this._handleError);
    }

    /**
     *  Send delete request to API
     */
    deleteAction (url: string): Observable<any[]> {
        
        return this._http.delete(`${this._appConfig.hostApi}${url}/user/${this.user.email}`)
                    .map(this._extractData)
                    .catch(this._handleError);
    }

    /**
     *  Send create request to API
     */
    postAction (url: string, data: any): Observable<any> {
        let body = JSON.stringify(data);

        return this._http.post(`${this._appConfig.hostApi}${url}/user/${this.user.email}`, body, this._options)
                        .map(this._extractData)
                        .catch(this._handleError);
    }

    /**
     *  Send update request to API
     */
    putAction (url: string, data: any): Observable<any> {
        let body = JSON.stringify(data);

        return this._http.put(`${this._appConfig.hostApi}${url}/user/${this.user.email}`, body, this._options)
                        .map(this._extractData)
                        .catch(this._handleError);
    }

    /**
     *  Retrieve data from API
     */
    getActionPr (url: string): Promise<any[]> {
        
        return this._http.get(`${this._appConfig.hostApi}${url}/user/${this.user.email}`)
                    .toPromise()
                    .then(this._extractData)
                    .catch(this._handleError);
    }

    /**
     *  Send delete request to API
     */
    deleteActionPr (url: string): Promise<any[]> {
        
        return this._http.delete(`${this._appConfig.hostApi}${url}/user/${this.user.email}`)
                    .toPromise()
                    .then(this._extractData)
                    .catch(this._handleError);
    }

    /**
     *  Send create request to API
     */
    postActionPr (url: string, data: any): Promise<any> {
        let body = JSON.stringify(data);

        return this._http.post(`${this._appConfig.hostApi}${url}/user/${this.user.email}`, body, this._options)
                        .toPromise()
                        .then(this._extractData)
                        .catch(this._handleError);
    }

    /**
     *  Send update request to API
     */
    putActionPr (url: string, data: any): Promise<any> {
        let body = JSON.stringify(data);

        return this._http.put(`${this._appConfig.hostApi}${url}/user/${this.user.email}`, body, this._options)
                        .toPromise()
                        .then(this._extractData)
                        .catch(this._handleError);
    }

    private _extractData(res: Response) {
        let body = res.json();

        return body.data || {};
    }

    private _handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead

        return Observable.throw(errMsg);
    }
}
