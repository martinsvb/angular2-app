import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/index';
import { CacheComponent } from '../shared/cache/cache.component';
import { TranslationComponent } from '../shared/translation/translation.component';
import { AppRequest } from '../shared/index';
import { CompanyModel } from './company.interface';
import { CompanyComponent } from './company.component';

@Component({
    moduleId: module.id,
    selector: 'companies',
    templateUrl: 'companies.component.html'
})
export class CompaniesComponent {
  
  private _apiUrl = "company";
  private _errorMessage: any;

  tr: any;
  user: any;
  alerts: any = {};
  companies: Array<CompanyModel>;
  selectedCompany: CompanyModel;
  showCompany: boolean = false;
  action: string = "update";
  
  constructor(
    private _tr: TranslationComponent,
    private _cache: CacheComponent,
    private _appRequest: AppRequest,
    private _nav: NavbarComponent
  ) {
    this.tr = _tr.getTranslation(_cache.getItem('lang'));
    this.user = _cache.getItem('user');

    _cache.dataAdded$.subscribe((data: any) => {
        if (data.hasOwnProperty('lang')) {
          this.tr = _tr.getTranslation(data['lang']);
        }
        if (data.hasOwnProperty('user')) {
            this.user = data['user'];
        }
    });

    this.getCompanies();
  }

  getCompanies() {
    this._appRequest.getAction(this._apiUrl)
                .subscribe((res: Array<CompanyModel>) => {
                    if (res.length > 0) {
                        this.companies = res;
                    }
                },
                (error: any) => console.log(error)
                );
  }

  newCompany() {
    this.selectedCompany = {
        id: 0,
        name: '',
        ico: '',
        email: '',
        active: false,
        street: '',
        street_nr: '',
        state: '',
        city: '',
        zip: '',
        phone: [],
        ts_created: 0
    };
    this.showCompany = true;
    this.action = "create";
  }

  selectCompany(company: CompanyModel) {
      this.selectedCompany = company;
      this.showCompany = true;
      this.action = "update";
  }

  compSubmit(event: string) {
    if (event !== "list") {
        this.alerts.info = event;
    }
    this.showCompany = false;
    this.getCompanies();
  }

  closeAlert(alert: string) {
    this.alerts[alert] = null;
  }

  compChange(index: number) {
    
    let sendData = [
        {
            id: this.companies[index].id,
            email: this.companies[index].email,
            active: !this.companies[index].active
        }
    ];

    this._appRequest.putAction(this._apiUrl + '/action/toggleActive', sendData)
                    .subscribe((res: any) => {
                        if (res.hasOwnProperty("warning")) {
                            this.alerts.warning = this.tr[res.warning];
                        }

                        if (res.hasOwnProperty("info")) {
                            if (res.info === 1) {
                                this.alerts.info = this.tr.companyChanged;
                                this.companies[index].active = !this.companies[index].active;
                            }

                            if (res.info === 0) {
                                this.alerts.warning = this.tr.companyNotChanged;
                            }
                        }
                    },
                        (error: any) => this.companies[index].active = !this.companies[index].active
                    );
  }

    showLink(link: string) {
        return this._nav.showLink(link);
    }
}
