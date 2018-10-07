import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

// Pages
import { DetailsPage } from '../../pages/details/details';

@Component({
    selector: 'list-component',
    templateUrl: 'list.component.html',
})
export class ListComponent {

    @Input() public object = null;
    @Input() public isFirst = false;
    @Input() public isLast = false;

    constructor(private navController: NavController) { }

    public displayDetails() {
        this.navController.push(DetailsPage, { location: this.object });
    }
}
