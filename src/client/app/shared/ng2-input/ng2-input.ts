import {
  Component,
  Input,
  Output,
  EventEmitter,
  NgZone,
  Provider,
  Inject,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, FORM_DIRECTIVES, ControlValueAccessor, NgModel } from '@angular/forms';
import { TranslationComponent } from '../translation/translation.component';

// Control Value accessor provider
const NG2INPUT_CONTROL_VALUE_ACCESSOR = new Provider(
  NG_VALUE_ACCESSOR,
  {
    useExisting: forwardRef(() => Ng2Input),
    multi: true
  }
);

@Component({
  selector: 'ng2-input',
  template: `
    <div class="form-group">
        <label *ngIf="label">{{ label }}</label>
        <span *ngIf="icon" class="form-group-addon"><i class="fa {{icon}}"></i></span>
        <input type="{{type}}" class="form-control" id="{{name}}" name="{{name}}" value="{{_value}}" #${name}="ngModel" {{required}} placeholder="{{placeholder}}" />
        <div [hidden]="name.valid || name.pristine" class="alert alert-danger">
            {{ tr[name] }} {{ tr.is }}  {{ tr.required }}
        </div>
    </div>
  `,
  providers: [TranslationComponent]
})

export class Ng2Input {

    @Input() type: string;
    @Input() name: string;
    @Input() label: string;
    @Input() icon: string;
    @Input() required: string;
    @Input() placeholder: string;

    @Output() change = new EventEmitter<any>();

    private _value: any;

    tr: any;

    constructor (
        private _zone: NgZone,
        private _tr: TranslationComponent
    ) {
        this.tr = _tr.getTranslation();
    }

    get value(): any { return this._value; };
    @Input() set value(v) {
        if (v !== this._value) {
            this._value = v;
            this._onChangeCallback(v);
        }
    }

    ngAfterViewInit () {}

    /**
     * Value update process
     */
    updateValue (value: any) {
        this._zone.run(() => {
            this._value = value;
            
            this.onChange(value);
            this._onTouchedCallback();
            this.change.emit(value);
        });
    }

    /**
     * Implements ControlValueAccessor
     */
    writeValue (value: any) {
        if (value) {
            this._value = value;

            if (typeof this.required !== 'undefined') {
                this.required = "required";
            }
        }
    }
    onChange (_: any) {}
    onTouched () {}
    registerOnChange (fn: any) { this.onChange = fn; }
    registerOnTouched (fn: any) { this.onTouched = fn; }
    _onChangeCallback (_: any) {}
    _onTouchedCallback () {}
}
