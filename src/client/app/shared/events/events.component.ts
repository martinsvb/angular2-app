import { EventEmitter } from '@angular/core';

export class EventsComponent {
    public itemAdded$: EventEmitter<any>;

    constructor() {
        this.itemAdded$ = new EventEmitter();
    }

    public add(item: any): void {
        this.itemAdded$.emit(item);
    }
}
