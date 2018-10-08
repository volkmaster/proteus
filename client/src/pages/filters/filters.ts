import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

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

        this.authService.getUser().subscribe(
            (user: any) => {
                this.username = user.username.toUpperCase();
            },
            (error: any) => {
                if (error.status === 401) {
                    this.authService.logout();
                    this.navCtrl.setRoot(LoginPage);
                }
            }
        );

        this.routeService.getFilters().subscribe(
            (filters: string[]) => {
                this.filters = filters;

                this.totalQuestions += this.filters.length;
                this.progressBarUnit = this.width / (this.totalQuestions + 1);
                this.currentProgress = this.progressBarUnit;

                this.loading = false;
            },
            (error: any) => {
                if (error.status === 401) {
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
