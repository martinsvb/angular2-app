import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';

import { NavbarComponent } from './shared/navbar/index';
import { CacheComponent } from './shared/cache/cache.component';
import { TranslationComponent } from './shared/translation/translation.component';
import { AppConfig, AppRequest } from './shared/index';

import { AppComponent } from './app.component';
import { AppComponents } from './app.components';
import { routes } from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    Ng2BootstrapModule
  ],
  declarations: [
    NavbarComponent,
    AppComponent,
    ...AppComponents
  ],
  providers: [
    {
        provide: APP_BASE_HREF,
        useValue: '<%= APP_BASE %>'
    },
    AppConfig,
    AppRequest,
    CacheComponent,
    TranslationComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}