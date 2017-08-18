import { EventEmitter } from '@angular/core';

export class NotificationService {
    public showErrorNotification$: EventEmitter<string>;

    constructor() {
        this.showErrorNotification$ = new EventEmitter();
    }

    public displayError(message) {
        this.showErrorNotification$.emit(message);
    }
}