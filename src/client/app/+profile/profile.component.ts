import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppConfig, AppRequest } from '../shared/index';
import { UserModel } from '../+users/user.interface';
import { TranslationComponent } from '../shared/translation/translation.component';
import { CacheComponent } from '../shared/cache/cache.component';
import { AlertComponent } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'sd-profile',
  templateUrl: 'profile.component.html',
  directives: [AlertComponent],
  providers: [AppConfig, AppRequest]
})
export class ProfileComponent {
  
  private _apiUrl = "user";
  private _errorMessage: any;

  hostUpload: string;
  tr: any;

  alerts: any = {};

  model: UserModel;
  userBack: any;

  constructor(
    private _tr: TranslationComponent,
    private _cache: CacheComponent,
    private _appRequest: AppRequest
  ) {
    this.tr = _tr.getTranslation(_cache.getItem('lang'));
    _cache.dataAdded$.subscribe((data: any) => {
        if (data.hasOwnProperty('user')) this.model = data['user'];
        this.model.chpassword = false;
        this.model.password = "";
        this.model.newpassword = "";
        this.model.newrepassword = "";

        this.userBack = this.model;

        if (data.hasOwnProperty('lang')) {
          this.tr = _tr.getTranslation(data['lang']);
        }
    });
  }

  isValid() {
    let valid = true;

    if (!this.model.email || !this.model.role) {
      valid = false;
    }

    if (this.model.chpassword && (
        !this.model.password || this.model.password.length < 5 ||
        !this.model.newpassword || this.model.newpassword.length < 5 ||
        !this.model.newrepassword || this.model.newrepassword.length < 5
    )) {
      valid = false;
    }

    return valid;
  }

  /**
   *  Send update request to API
   */
  changeProfile() {
      
      let sendData = [this.model];

      this._appRequest.putAction(this._apiUrl, sendData)
                      .subscribe((res: any) => {
                        if (res.hasOwnProperty("warning")) {
                          this.alerts.warning = this.tr[res.warning];
                        }

                        if (res.hasOwnProperty("info")) {
                          if (res.info === 1) {
                            this.alerts.info = this.tr.profileChanged;
                          }

                          if (res.info === 0) {
                            this.alerts.warning = this.tr.profileNotChanged;
                            this.model = this.userBack;
                          }
                        }
                      },
                        (error: any) =>  this._errorMessage = error
                      );
  }

  /**
   *  Close profile info alert
   */
  closeAlert(alert: string) {
    this.alerts[alert] = null;
  }
}
