import { Component } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { AppConfig, AppRequest } from '../shared/index';
import { TranslationComponent } from '../shared/translation/translation.component';
import { CacheComponent } from '../shared/cache/cache.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ModuleComponent } from './module.component';
import { ModuleModel } from './module.interface';
import { AlertComponent } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    moduleId: module.id,
    selector: 'modules',
    templateUrl: 'modules.component.html',
    providers: [AppConfig, AppRequest, NavbarComponent],
    directives: [CORE_DIRECTIVES, ModuleComponent, AlertComponent]
})
export class ModulesComponent {
  
  private _apiUrl = "module";
  private _errorMessage: any;

  tr: any;
  alerts: any = {};
  modules: Array<ModuleModel>;
  roleList: Array<string>;
  selectedModule: ModuleModel;
  description: any = {};
  showModule: boolean = false;
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

    this.getModules();
  }

  getModules() {
    this._appRequest.getAction(this._apiUrl)
                .subscribe((res: Array<ModuleModel>) => {
                    if (res.length > 0) {
                        this.modules = res;
                    }
                },
                (error: any) => console.log(error)
                );
  }

  newModule() {
    this.selectedModule = {
        id: 0,
        name: '',
        active: false,
        description: '',
        role: {},
        ts_created: 0
    };
    this.showModule = true;
    this.action = "create";
  }

  selectModule(module: ModuleModel) {
    if (!module.hasOwnProperty('role') || !module.role) {
        module.role = {};
    }
    this.selectedModule = module;
    this.showModule = true;
    this.action = "update";
  }

  moduleSubmit(event: string) {
    if (event !== "list") {
        this.alerts.info = event;
    }
    this.showModule = false;
    this.getModules();
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

  moduleChange(index: number) {
    
    let sendData = [{
        id: this.modules[index].id,
        name: this.modules[index].name,
        active: !this.modules[index].active
    }];

    this._appRequest.putAction(this._apiUrl + '/action/toggleActive', sendData)
                    .subscribe((res: any) => {
                        if (res.hasOwnProperty("warning")) {
                            this.alerts.warning = this.tr[res.warning];
                        }

                        if (res.hasOwnProperty("info")) {
                            if (res.info === 1) {
                                this.alerts.info = this.tr.moduleChanged;
                                this.modules[index].active = !this.modules[index].active;
                            }

                            if (res.info === 0) {
                                this.alerts.warning = this.tr.moduleNotChanged;
                            }
                        }
                    },
                        (error: any) => this.modules[index].active = !this.modules[index].active
                    );
  }

    showLink(link: string) {
        return this._nav.showLink(link);
    }
}
