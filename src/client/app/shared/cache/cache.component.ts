import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 *  Cache component
 */
@Injectable()
export class CacheComponent {
    
    private ls = window.localStorage;
    private _subject = new BehaviorSubject<any>(0);
    dataAdded$ = this._subject.asObservable();

    setItem(key: string, value: any) {
        let data: any = this.ls.getItem('data');
        
        data = data ? JSON.parse(data) : {};
        data[key] = value;

        this.ls.setItem('data', JSON.stringify(data));
        this._subject.next(data);
    }

    getItem(key: string) {
        let result: any;
        let data: any = this.ls.getItem('data');

        if (data) {
            data = JSON.parse(data);
            if (data.hasOwnProperty(key)) {
                result = data[key];
            }
        }

        return result;
    }
}
