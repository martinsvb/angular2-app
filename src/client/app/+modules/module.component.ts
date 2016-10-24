import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppConfig, AppRequest } from '../shared/index';
import { ModuleModel } from './module.interface';
import { RoleModel } from '../+roles/role.interface';
import { TranslationComponent } from '../shared/translation/translation.component';
import { CacheComponent } from '../shared/cache/cache.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AlertComponent } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'module',
  templateUrl: 'module.component.html',
  directives: [AlertComponent],
  providers: [AppConfig, AppRequest, NavbarComponent]
})
export class ModuleComponent {
  
  private _apiUrl = "module";
  private _errorMessage: any;

  res: any;
  hostUpload: string;
  tr: any;

  alerts: any = {};

  @Input() module: ModuleModel;
  @Input() action: string;
  moduleBack: any;

  @Output() moduleSubmit = new EventEmitter<string>();

  roles: Array<RoleModel>;

  constructor(
    private _tr: TranslationComponent,
    private _cache: CacheComponent,
    private _appRequest: AppRequest,
    private _nav: NavbarComponent
  ) {
    this.tr = _tr.getTranslation(_cache.getItem('lang'));
    
    this.moduleBack = this.module;

    _cache.dataAdded$.subscribe((data: any) => {
        if (data.hasOwnProperty('lang')) {
          this.tr = _tr.getTranslation(data['lang']);
        }
    });
  }

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this._appRequest.getAction("role")
                .subscribe((res: Array<RoleModel>) => {
                    if (res.length > 0) {
                        this.roles = res;
                        for (var i = 0; i < this.roles.length; i++) {
                          let roleName = this.roles[i].name;
                          if (!this.module.role.hasOwnProperty(roleName)) {
                            this.module.role[roleName] = false;
                          }
                        }
                    }
                },
                (error: any) => console.log(error)
                );
  }

  /**
   *  Send update request to API
   */
  onSubmit() {
      
      let sendData = [this.module];
      
      if (this.action == "create") {
        this._appRequest.postAction(this._apiUrl, sendData)
                        .subscribe((res: any) => {
                          if (res.hasOwnProperty("warning")) {
                            this.alerts.warning = this.tr[res.warning];
                          }

                          if (res.hasOwnProperty("info")) {
                            if (res.info === 1) {
                              this.moduleSubmit.emit(this.tr.moduleSaved);
                            }

                            if (res.info === 0) {
                              this.alerts.warning = this.tr.moduleNotSaved;
                              this.module = this.moduleBack;
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
                              this.alerts.info = this.tr.moduleChanged;
                            }

                            if (res.info === 0) {
                              this.alerts.warning = this.tr.moduleNotChanged;
                              this.module = this.moduleBack;
                            }
                          }
                        },
                          (error: any) =>  this._errorMessage = error
                        );
      }
  }

  list() {
    this.moduleSubmit.emit("list");
  }

  /**
   *  Close module alert
   */
  closeAlert(alert: string) {
    this.alerts[alert] = null;
  }

    showLink(link: string) {
        return this._nav.showLink(link);
    }
}
