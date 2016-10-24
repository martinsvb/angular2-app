import { Component, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { Ng2Summernote } from 'ng2-summernote/ng2-summernote';
import { AppConfig, AppRequest } from '../shared/index';
import { TranslationComponent } from '../shared/translation/translation.component';
import { CacheComponent } from '../shared/cache/cache.component';
import { LoginModel } from './login.interface';
import { AlertComponent } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'sd-login',
  templateUrl: 'login.component.html',
  directives: [ROUTER_DIRECTIVES, AlertComponent],
  providers: [AppConfig, AppRequest]
})
export class LoginComponent {
  
  private _apiUrl = "login";

  private _errorMessage: any;

  tr: any;
  res: any;

  loginAlerts: any = {};

  // Reset the form with a new hero AND restore 'pristine' class state
  // by toggling 'active' flag which causes the form
  // to be removed/re-added in a tick via NgIf
  // TODO: Workaround until NgForm has a reset method (#6822)
  active: boolean = true;

  model: LoginModel = {
    email: '',
    password: ''
  };

  constructor(
    private _tr: TranslationComponent,
    private _appRequest: AppRequest,
    private _cache: CacheComponent,
    private _router: Router
  ) {
    this.tr = _tr.getTranslation(_cache.getItem('lang'));
    _cache.dataAdded$.subscribe((data: any) => {
        if (data.hasOwnProperty('lang')) {
          this.tr = _tr.getTranslation(data['lang']);
        }
    });
  }

  login() {
    
    this._appRequest.postAction(this._apiUrl, this.model)
                    .subscribe((res: any) => {
                        if (res.hasOwnProperty("loginWarning")) {
                          if (res.loginWarning === "userNotExists") {
                            this.loginAlerts.loginWarning = this.tr.userNotExists(this.model.email);
                          }
                          else {
                            this.loginAlerts.loginWarning = this.tr[res.loginWarning];
                          }
                        }

                        if (res.hasOwnProperty("loginInfo")) {
                          if (res.loginInfo === 1) {
                            this._cache.setItem('user', res);

                            this._router.navigate(['/']);
                          }

                          if (res.loginInfo === 0) {
                            this.loginAlerts.loginWarning = this.tr.userNotLogged;
                          }
                        }
                    }
                    ,(error: any) =>  this._errorMessage = error);
  }

  /**
   *  Close login info alert
   */
  closeAlert(alert: string) {
    this.loginAlerts[alert] = null;
  }
}
