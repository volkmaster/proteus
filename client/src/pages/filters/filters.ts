import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

// Services
import { FilterService } from '../../providers/filter.service';

// Pages
import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
    selector: 'page-filters',
    templateUrl: 'filters.html'
})
export class FiltersPage {

	public questionCounter = 0;
	public questionsNumber = 10;
	public width = 0;
	public offset = 0;
	public progressBarUnit = 0;
	public currentProgress = 0;
    public images = ['cerkev', 'domacija', 'freska', 'grad', 'kozolec', 'kulinarika', 'najdisce'];

    constructor(
        private navCtrl: NavController,
        private platform: Platform,
        private filterService: FilterService
    ) {
        platform.ready().then(readySource => {
            this.width = platform.width();
            this.progressBarUnit = this.width / this.questionsNumber;
            this.currentProgress = this.progressBarUnit;
        });
    }

    ionViewDidLoad() { }

    public goToHome() {
        this.navCtrl.push(HomePage);
    }

    nextQuestion(counter: number) {
  	    this.questionCounter++;

        if (this.questionCounter === this.questionsNumber - 1) {
            this.navCtrl.push(DashboardPage);
        }

  	    this.offset = this.width * this.questionCounter + 100 * this.questionCounter;
  	    this.currentProgress += this.progressBarUnit;
    }

}
