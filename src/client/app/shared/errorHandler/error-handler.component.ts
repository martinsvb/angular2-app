import {Component, Input} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'sd-alert',
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
