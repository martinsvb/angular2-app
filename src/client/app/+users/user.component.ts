import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppConfig, AppRequest } from '../shared/index';
import { UserModel } from './user.interface';
import { CompanyModel } from '../+companies/company.interface';
import { ModuleModel } from '../+modules/module.interface';
import { RoleModel } from '../+roles/role.interface';
import { TranslationComponent } from '../shared/translation/translation.component';
import { CacheComponent } from '../shared/cache/cache.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AlertComponent, BUTTON_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'user',
  templateUrl: 'user.component.html',
  directives: [AlertComponent, BUTTON_DIRECTIVES],
  providers: [AppConfig, AppRequest, NavbarComponent]
})
export class UserComponent {
  
  private _apiUrl = "user";
  private _errorMessage: any;

  res: any;
  hostUpload: string;
  tr: any;

  alerts: any = {};

  @Input() user: UserModel;
  @Input() action: string;
  userBack: any;

  @Output() userSubmit = new EventEmitter<string>();

  companies: Array<CompanyModel>;
  modules: Array<ModuleModel>;
  roles: Array<RoleModel>;
  loggedUser: UserModel;

  constructor(
    private _tr: TranslationComponent,
    private _cache: CacheComponent,
    private _appRequest: AppRequest,
    private _nav: NavbarComponent
  ) {
    this.tr = _tr.getTranslation(_cache.getItem('lang'));

    _cache.dataAdded$.subscribe((data: any) => {
        if (data.hasOwnProperty('lang')) {
          this.tr = _tr.getTranslation(data['lang']);
        }
    });
  }

  ngOnInit() {
    this.userBack = this.user;
    this.loggedUser = this._cache.getItem('user');

    this.getCompanies();
    this.getModules();
    this.getRoles();
  }

  getCompanies() {
    this._appRequest.getAction("company")
                .subscribe((res: Array<CompanyModel>) => {
                    if (res.length > 0) {
                        this.companies = res;
                    }
                },
                (error: any) => console.log(error)
                );
  }

  getModules() {
    this._appRequest.getAction("module")
                .subscribe((res: Array<ModuleModel>) => {
                    if (res.length > 0) {
                        this.modules = res;
                        for (var i = 0; i < this.modules.length; i++) {
                          let modName = this.modules[i].name;
                          if (!this.user.modules.hasOwnProperty(modName)) {
                            this.user.modules[modName] = {};
                            this.user.modules[modName].read = false;
                            this.user.modules[modName].write = false;
                            this.user.modules[modName].del = false;
                          }
                        }
                    }
                },
                (error: any) => console.log(error)
                );
  }

  getRoles() {
    this._appRequest.getAction("role")
                .subscribe((res: Array<RoleModel>) => {
                    if (res.length > 0) {
                        this.roles = res;
                    }
                },
                (error: any) => console.log(error)
                );
  }

  /**
   *  Send update request to API
   */
  onSubmit() {
      
      let sendData = [this.user];
      
      if (this.action == "create") {
        this._appRequest.postAction(this._apiUrl, sendData)
                        .subscribe((res: any) => {
                          if (res.hasOwnProperty("warning")) {
                            this.alerts.warning = this.tr[res.warning];
                          }

                          if (res.hasOwnProperty("info")) {
                            if (res.info === 1) {
                              this.userSubmit.emit(this.tr.userSaved);
                            }

                            if (res.info === 0) {
                              this.alerts.warning = this.tr.userNotSaved;
                              this.user = this.userBack;
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
                              this.alerts.info = this.tr.userChanged;
                            }

                            if (res.info === 0) {
                              this.alerts.warning = this.tr.userNotChanged;
                              this.user = this.userBack;
                            }
                          }
                        },
                          (error: any) =>  this._errorMessage = error
                        );
      }
  }

  list() {
    this.userSubmit.emit("list");
  }

  /**
   *  Close User alert
   */
  closeAlert(alert: string) {
    this.alerts[alert] = null;
  }

    showLink(link: string) {
        return this._nav.showLink(link);
    }
}
