import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

// Pages
import { DetailsPage } from '../pages/details/details';

@Component({
    selector: 'list-component',
    templateUrl: 'list-component.html',
})
export class ListComponent {

    constructor(private navController: NavController) { }

    @Input() public object: any = null;
    @Input() public isFirst: boolean = false;
    @Input() public isLast: boolean = false;

    public displayDetails() {
        this.navController.push(DetailsPage, { heritage: this.object });
    }
}
