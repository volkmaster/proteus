import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

// Services
import { RouteService } from '../../providers/route.service';

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

    // Image names and their mapped categories
    public images = ['cerkev', 'domacija', 'freska', 'grad', 'kozolec', 'kulinarika', 'najdisce'];
    public imageCategories = ['church', 'regional', 'art', 'castle', 'kozolec', 'culinary', 'archeological'];

    private preferences: Array<any> = [];

    constructor(
        private navCtrl: NavController,
        private platform: Platform,
        private routeService: RouteService
    ) {
        platform.ready().then(readySource => {
            this.width = platform.width();
            this.progressBarUnit = this.width / this.questionsNumber;
            this.currentProgress = this.progressBarUnit;
        });
    }

    public goToHome() {
        this.navCtrl.push(HomePage);
    }

    nextQuestion(idname: string) {
  	    this.questionCounter++;

        // Setting filters
        switch (this.questionCounter) {
            case 1:
                this.routeService.setTravelDuration(idname);
                break;
            case 2:
                this.routeService.setTravelMethod(idname);
                break;
            default:
                if(idname !== 'den'){
                    this.preferences.push(this.imageCategories[this.questionCounter - 3]);
                }
                break;
        }

        if (this.questionCounter === this.questionsNumber - 1) {
            this.routeService.setPreferences(this.preferences);
            this.navCtrl.push(DashboardPage);
        }

  	    this.offset = this.width * this.questionCounter + 100 * this.questionCounter;
  	    this.currentProgress += this.progressBarUnit;
    }

}
