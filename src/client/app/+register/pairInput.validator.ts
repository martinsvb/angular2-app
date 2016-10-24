import {provide, Directive, Input} from '@angular/core';
import {NG_VALIDATORS, Control, Validator} from '@angular/common';

@Directive({
    selector: '[equal-to][ng-control],[equal-to][ng-form-control],[equal-to][ng-model]',
    providers: [
        provide(NG_VALIDATORS, {
            useExisting: EqualToValidator,
            multi: true
        })
    ]
})

export class EqualToValidator implements Validator {
    
    @Input('equalTo') target: Control;
    
    constructor() {}

    validate(control: Control): {[key: string]: any} {
        return this.target.value !== control.value
            ? {'equalTo': true}
            : null;
    }
}
