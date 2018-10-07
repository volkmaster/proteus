import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

// Services
import { AuthService } from '../../providers/auth.service';
import { RouteService } from '../../providers/route.service';

// Pages
import { LoginPage } from '../login/login';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
    selector: 'page-filters',
    templateUrl: 'filters.html'
})
export class FiltersPage {

    public loading = true;
    public username = '';
    public filters = [];
    public images = {
        archeological: 'najdisce',
        church: 'cerkev',
        historical: 'grad', // 'freska'
        museum: 'muzej',
        regional: 'domacija' // 'kulinarika', 'kozolec'
    };
	public questionIndex = 0;
	public totalQuestions = 2;
	public width = 0;
	public offset = 0;
	public progressBarUnit = 0;
	public currentProgress = 0;

    constructor(
        private navCtrl: NavController,
        private platform: Platform,
        private authService: AuthService,
        private routeService: RouteService
    ) {
        platform.ready().then(readySource => {
            this.width = platform.width();
        });
    }

    ionViewDidLoad() {
        this.loading = true;

        Observable.forkJoin([
            this.authService.getUser(),
            this.routeService.getFilters()
        ]).subscribe(
            (responses: any[]) => {
                const [user, filters] = responses;
                this.username = user.username.toUpperCase();
                this.filters = filters;

                this.totalQuestions += this.filters.length;
                this.progressBarUnit = this.width / this.totalQuestions;
                this.currentProgress = this.progressBarUnit;

                this.loading = false;
            },
            (errors: any[]) => {
                const statuses = errors.map(error => error.status);
                if (statuses.indexOf(401) >= 0) {
                    this.authService.logout();
                    this.navCtrl.setRoot(LoginPage);
                }
            }
        );
    }

    public setTravelDuration(travelDuration: string) {
        this.routeService.setTravelDuration(travelDuration);
        this.nextQuestion();
    }

    public setTravelMethod(travelMethod: string) {
        this.routeService.setTravelMethod(travelMethod);
        this.nextQuestion();
    }

    public addPreference(filter: string) {
        this.routeService.addPreference(filter);
        this.nextQuestion();
    }

    public nextQuestion() {
        this.questionIndex++;

        if (this.questionIndex === this.totalQuestions) {
            this.navCtrl.push(DashboardPage);
        }

        this.offset = this.width * this.questionIndex + 100 * this.questionIndex;
        this.currentProgress += this.progressBarUnit;
    }

}
