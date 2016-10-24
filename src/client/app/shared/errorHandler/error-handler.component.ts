import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {FORM_DIRECTIVES} from '@angular/forms';
import {AlertComponent} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'sd-alert',
  directives: [AlertComponent, CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: 'error-handler.component.html',
  providers: []
})

export class ErrorHandlerComponent {
  private _alerts: any[] = [{
                type: "warning",
                msg: "Alert",
                closeable: true
            }];
  
  public addAlert(alert: any): void {
    this._alerts.push(alert);
  }

  public closeAlert(i: number): void {
    this._alerts.splice(i, 1);
  }
}
