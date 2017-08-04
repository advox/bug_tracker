import {
    Component,
    OnInit
} from '@angular/core';

@Component({
    selector: 'task',  // <home></home>
    templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit {
    /**
     * Set our default values
     */
    public localState = { value: '' };
    /**
     * TypeScript public modifiers
     */

    public ngOnInit() {
        console.log('hello `Home` component');
        /**
         * this.title.getData().subscribe(data => this.data = data);
         */
    }

}
