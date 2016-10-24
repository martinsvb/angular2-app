import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationComponent } from '../translation/translation.component';
import { CacheComponent } from '../cache/cache.component';

/**
 * This class represents the navigatin bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html'
})

export class NavbarComponent {

    lang: string;
    langTr: string;
    tr: any;
    user: any;

    constructor(
        private _tr: TranslationComponent,
        private _cache: CacheComponent,
        private _router: Router
    ) {
        this.lang = this._cache.getItem('lang') || "en";
        this.user = this._cache.getItem('user');
        this.tr = this._tr.getTranslation(this.lang);
        
        this._cache.dataAdded$.subscribe((data: any) => {
            if (data.hasOwnProperty('user')) {
                this.user = data['user'];
            }
            if (data.hasOwnProperty('lang')) {
                this.lang = data.lang || this.lang;
                this.tr = this._tr.getTranslation(this.lang);
            }
        });
    }

    showLink(link: string) {
        return this.user.modules.hasOwnProperty(link);
    }

    logout() {
        this.user = {
            name: 'guest',
            email: 'guest@guest.cz',
            role: 'guest',
            modules: {}
        };

        this._cache.setItem('user', this.user);

        this._router.navigate(['/']);
    }

    translation(lang: string) {
        this._cache.setItem('lang', lang);
    }
}
