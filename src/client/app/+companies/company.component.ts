import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppConfig, AppRequest } from '../shared/index';
import { CompanyModel } from './company.interface';
import { TranslationComponent } from '../shared/translation/translation.component';
import { CacheComponent } from '../shared/cache/cache.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AlertComponent } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'company',
  templateUrl: 'company.component.html',
  directives: [AlertComponent],
  providers: [AppConfig, AppRequest, NavbarComponent]
})
export class CompanyComponent {
  
  private _apiUrl = "company";
  private _errorMessage: any;

  res: any;
  hostUpload: string;
  tr: any;

  alerts: any = {};

  @Input() company: CompanyModel;
  @Input() action: string;
  companyBack: any;

  @Output() compSubmit = new EventEmitter<string>();

  constructor(
    private _tr: TranslationComponent,
    private _cache: CacheComponent,
    private _appRequest: AppRequest,
    private _nav: NavbarComponent
  ) {
    this.tr = _tr.getTranslation(_cache.getItem('lang'));
    
    this.companyBack = this.company;

    _cache.dataAdded$.subscribe((data: any) => {
        if (data.hasOwnProperty('lang')) {
          this.tr = _tr.getTranslation(data['lang']);
        }
    });
  }

  /**
   *  Send update request to API
   */
  onSubmit() {
      
      let sendData = [this.company];
      
      if (this.action == "create") {
        this._appRequest.postAction(this._apiUrl, sendData)
                        .subscribe((res: any) => {
                          if (res.hasOwnProperty("warning")) {
                            this.alerts.warning = this.tr[res.warning];
                          }

                          if (res.hasOwnProperty("info")) {
                            if (res.info === 1) {
                              this.compSubmit.emit(this.tr.companySaved);
                            }

                            if (res.info === 0) {
                              this.alerts.warning = this.tr.companyNotSaved;
                              this.company = this.companyBack;
                            }
                          }
                          
                        },
                          (error: any) =>  this._errorMessage = error
                        );
      }

      if (this.action == "update") {
        this._appRequest.putAction(this._apiUrl, sendData)
                        .subscribe((res: any) => {
                          if (res.hasOwnProperty("warning")) {
                            this.alerts.warning = this.tr[res.warning];
                          }

                          if (res.hasOwnProperty("info")) {
                            if (res.info === 1) {
                              this.alerts.info = this.tr.companyChanged;
                            }

                            if (res.info === 0) {
                              this.alerts.warning = this.tr.companyNotChanged;
                              this.company = this.companyBack;
                            }
                          }
                        },
                          (error: any) =>  this._errorMessage = error
                        );
      }
  }

  list() {
    this.compSubmit.emit("list");
  }

  /**
   *  Close company alert
   */
  closeAlert(alert: string) {
    this.alerts[alert] = null;
  }

    showLink(link: string) {
        return this._nav.showLink(link);
    }
}
