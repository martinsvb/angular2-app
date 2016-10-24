import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesComponent, CompanyComponent } from './index';

@NgModule({
  imports: [CommonModule],
  declarations: [CompaniesComponent, CompanyComponent],
  exports: [],
  providers: []
})
export class HomeModule { }