import { Component } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { AppConfig, AppRequest } from '../shared/index';
import { TranslationComponent } from '../shared/translation/translation.component';
import { CacheComponent } from '../shared/cache/cache.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { RoleComponent } from './role.component';
import { RoleModel } from './role.interface';
import { AlertComponent } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    moduleId: module.id,
    selector: 'roles',
    templateUrl: 'roles.component.html',
    providers: [AppConfig, AppRequest, NavbarComponent],
    directives: [CORE_DIRECTIVES, RoleComponent, AlertComponent]
})
export class RolesComponent {
  
  private _apiUrl = "role";
  private _errorMessage: any;

  tr: any;
  alerts: any = {};
  roles: Array<RoleModel>;
  selectedRole: RoleModel;
  description: any = {};
  showRole: boolean = false;
  action: string = "update";
  
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

    this.getRoles();
  }

  getRoles() {
    this._appRequest.getAction(this._apiUrl)
                .subscribe((res: Array<RoleModel>) => {
                    if (res.length > 0) {
                        this.roles = res;
                    }
                },
                (error: any) => console.log(error)
                );
  }

  newRole() {
    this.selectedRole = {
        id: 0,
        name: '',
        active: false,
        description: '',
        ts_created: 0
    };
    this.showRole = true;
    this.action = "create";
  }

  selectRole(role: RoleModel) {
      this.selectedRole = role;
      this.showRole = true;
      this.action = "update";
  }

  roleSubmit(event: string) {
    if (event !== "list") {
        this.alerts.info = event;
    }
    this.showRole = false;
    this.getRoles();
  }

  closeAlert(alert: string) {
    this.alerts[alert] = null;
  }

  hideDescription(i: number) {
      let result = true;
      if (this.description.hasOwnProperty(i) && this.description[i] === true) {
        result = false;
      }

      return result;
  }

  showDescriptionChange(i: number) {
      this.description[i] = !this.description.hasOwnProperty(i)
        ? true
        : !this.description[i];
  }

  roleChange(index: number) {
    
    let sendData = [{
        id: this.roles[index].id,
        name: this.roles[index].name,
        active: !this.roles[index].active
    }];

    this._appRequest.putAction(this._apiUrl + '/action/toggleActive', sendData)
                    .subscribe((res: any) => {
                        if (res.hasOwnProperty("warning")) {
                            this.alerts.warning = this.tr[res.warning];
                        }

                        if (res.hasOwnProperty("info")) {
                            if (res.info === 1) {
                                this.alerts.info = this.tr.roleChanged;
                                this.roles[index].active = !this.roles[index].active;
                            }

                            if (res.info === 0) {
                                this.alerts.warning = this.tr.roleNotChanged;
                            }
                        }
                    },
                        (error: any) => this.roles[index].active = !this.roles[index].active
                    );
  }

    showLink(link: string) {
        return this._nav.showLink(link);
    }
}
