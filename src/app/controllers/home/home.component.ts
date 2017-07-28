import {
    Component,
    OnInit
} from '@angular/core';

@Component({
    selector: 'home',  // <home></home>
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
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
