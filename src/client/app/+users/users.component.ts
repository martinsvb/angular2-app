import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/index';
import { CacheComponent } from '../shared/cache/cache.component';
import { TranslationComponent } from '../shared/translation/translation.component';
import { AppRequest } from '../shared/index';
import { UserComponent } from './user.component';
import { UserModel } from './user.interface';

@Component({
    moduleId: module.id,
    selector: 'users',
    templateUrl: 'users.component.html'
})
export class UsersComponent {
  
  private _apiUrl = "user";
  private _errorMessage: any;

  tr: any;
  alerts: any = {};
  users: Array<UserModel>;
  selectedUser: UserModel;
  description: any = {};
  showUser: boolean = false;
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

    this.getUsers();
  }

  getUsers() {
    this._appRequest.getAction(this._apiUrl + "/activeString/0-1")
                .subscribe((res: Array<UserModel>) => {
                    if (res.length > 0) {
                        this.users = res;
                    }
                },
                (error: any) => console.log(error)
                );
  }

  newUser() {
    this.selectedUser = {
        id: 0,
        comp_id: 0,
        comp_name: '',
        name: '',
        email: '',
        chpassword: false,
        password: '',
        newpassword: '',
        newrepassword: '',
        role: '',
        modules: {},
        active: false,
        ts_created: 0
    };
    this.showUser = true;
    this.action = "create";
  }

  selectUser(user: UserModel) {
    if (!user.hasOwnProperty('modules') || !user.modules) {
        user.modules = {};
    }
    this.selectedUser = user;
    this.showUser = true;
    this.action = "update";
  }

  userSubmit(event: string) {
    if (event !== "list") {
        this.alerts.info = event;
    }
    this.showUser = false;
    this.getUsers();
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

  userChange(index: number) {
    
    let sendData = [{
        id: this.users[index].id,
        email: this.users[index].email,
        active: !this.users[index].active
    }];

    this._appRequest.putAction(this._apiUrl + '/action/toggleActive', sendData)
                    .subscribe((res: any) => {
                        if (res.hasOwnProperty("warning")) {
                            this.alerts.warning = this.tr[res.warning];
                        }

                        if (res.hasOwnProperty("info")) {
                            if (res.info === 1) {
                                this.alerts.info = this.tr.userChanged;
                                this.users[index].active = !this.users[index].active;
                            }

                            if (res.info === 0) {
                                this.alerts.warning = this.tr.userNotChanged;
                            }
                        }
                    },
                        (error: any) => this.users[index].active = !this.users[index].active
                    );
  }

    showLink(link: string) {
        return this._nav.showLink(link);
    }
}
