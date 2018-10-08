import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

// Services
import { AuthService } from '../../providers/auth.service';
import { RouteService } from '../../providers/route.service';
import { ToastService } from '../../providers/toast.service';

// Pages
import { LoginPage } from '../login/login';
import { QrCodePage } from '../qr-code/qr-code';

@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html',
})
export class DashboardPage {

    public loading = true;
    public username = '';
    public route = null;

    constructor(
        private platform: Platform,
        private navCtrl: NavController,
        private launchNavigator: LaunchNavigator,
        private authService: AuthService,
        private routeService: RouteService,
        private toastService: ToastService
    ) { }

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

        this.routeService.getRoute().subscribe(
            (route: any[]) => {
                this.route = route;
                this.loading = false;
            },
            (error: any) => {
                if (error.status === 401) {
                    this.authService.logout();
                    this.navCtrl.setRoot(LoginPage);
                }
                this.loading = false;
            }
        );
    }

    public launchGoogleMaps() {
        if (!this.platform.is('cordova')) {
            return;
        }

        //let destination = '46.5578150128,15.6441992715+to:46.1897107375,13.5781269643+to:46.4033908192,15.789574195+to:46.0531350293,14.4941779725+to:46.0507936357,14.4998464159';

        let destination = '';
        let i = 0;
        for (const node of this.route) {
            destination += `${node.latitude},${node.longitude}`;
            if (i++ < this.route.length - 1) {
                destination += '+to:';
            }
        }

        this.launchNavigator.isAppAvailable(this.launchNavigator.APP.GOOGLE_MAPS).then((isAvailable: boolean) => {
            if (isAvailable) {
                this.launchNavigator.navigate(destination)
                    .then(() => { })
                    .catch(error => this.toastService.show('Error launching Google Maps: ' + error, 5000));
            }
        });
    }

    public goToQrCode() {
        if (!this.platform.is('cordova')) {
            return;
        }

        this.navCtrl.push(QrCodePage);
    }

    public routes = [
        [
            {
                title: 'Hotel Slon',
                description: '',
                startTime: '9:00',
                endTime: null,
                sound: null,
                icon: '../assets/imgs/icon_home.svg'
            },
            {
                title: 'Domačija Žuniči',
                description: 'Skupina objektov je nepremična kulturna in profana stavbna dediščina s sredine 19. stoletja in je tudi info center parka. Domačija stoji ob glavni cesti Marindol-Vinica.',
                startTime: '10:40',
                endTime: '11:40',
                sound: null,
                icon: '../assets/imgs/icon_farm.svg',
                image: '../assets/imgs/zunici.jpg'
            },
            {
                title: 'Semič - Cerkev sv. Štefana',
                description: 'V virih prvič omenjena 1228, v začetku 16. stol. utrjena v tabor. Srednjeveško zasnovana cerkev je ob predelavi v 18. stol. dobila centralno zasnovan prezbiterij in pravokotno, kasneje podaljšano ladjo. Baročna oprema je bila predelana v 19. stol.',
                startTime: '12:00',
                endTime: '13:00',
                sound: null,
                icon: '../assets/imgs/icon_church.svg'
            },
            {
                title: 'Gostišče Kapušin',
                description: '',
                startTime: '13:15',
                endTime: '14:45',
                sound: null,
                icon: '../assets/imgs/icon_food.svg'
            },
            {
                title: 'Semič - Razvaline gradu Smuk',
                description: 'Od začetka 17. do srede 19. stol. je bil v lasti grofov Lichtenberg, od konca 19. stol. je razvalina. Grad je nadomestil starejše  srednjeveško poslopje, pozidano na strateškem vrhu Smuk.',
                startTime: '15:00',
                endTime: '16:00',
                sound: null,
                icon: '../assets/imgs/icon_castle.svg'
            },
            {
                title: 'Črnomelj - Arheološko najdišče Pastoralni center',
                description: 'Prezentirani arhitekturni ostanki, odkriti 1995-96, ki sodijo v tri časovne faze. Prvo fazo predstavlja poznorimsko obzidje s pravokotnim stolpom, drugo stavba in mestno obzidje s preloma 14. in 15. stol., tretjo obzidje in stavba s konca 15. stol.',
                startTime: '16:10',
                endTime: '17:10',
                sound: null,
                icon: '../assets/imgs/icon_archeology.svg'
            },
            {
                title: 'Hotel Slon',
                description: '',
                startTime: '18:40',
                endTime: null,
                sound: null,
                icon: '../assets/imgs/icon_home.svg'
            }
        ],
        [
            {
                title: 'Semenišče - Ljubljanska Tržnica',
                description: '',
                startTime: '9:00',
                endTime: null,
                sound: null,
                icon: '../assets/imgs/icon_church.svg'
            },
            {
                title: 'Cerkev sv. Jožefa',
                description: 'Neoromanska cerkev z večjo ladjo in kupolnim prostorom, prizidana 1912-1913 k samostanu (arh. A. Werner). Cerkveno opremo je načrtoval arh. Plečnik (1922-1943); oltar sv. Jožefa in ureditev prezbiterija z beuronskimi barvami sten sta iz 1941.',
                startTime: '9:15',
                endTime: '9:45',
                sound: null,
                icon: '../assets/imgs/icon_church.svg'
            },
            {
                title: 'Cerkev sv. Nikolaja',
                description: 'Dvostolpna cerkev, sezidana 1700-1708 po načrtih Andrea Pozza kot baročna dvorana s križiščem in prvotno navidezno kupolo. Bogata notranja oprema in iluzionistična poslikava G. Quaglie (1703-1706).',
                startTime: '10:05',
                endTime: '10:35',
                sound: null,
                icon: '../assets/imgs/icon_church.svg'
            },
            {
                title: 'Palača Kazina',
                description: 'Večnamenska javna palača, zgrajena 1835-1837 pod vodstvom V. Vadnava, je strogo klasicistična arhitektura, ki odraža racionalizem 1. polovice 19. stol. Krasitvena dela v dvorani iz 19. stol. dopolnjujejo interierji v slogu funkcionalizma.',
                startTime: '10:45',
                endTime: '11:45',
                sound: 'uniqueId1',
                icon: '../assets/imgs/icon_castle.svg',
                image: '../assets/imgs/kazina.jpg'
            },
            {
                title: 'Frančiškanski samostan',
                description: 'Nad trgom stoji baročni avguštinski (sedaj frančiškanski) samostan (18. stol.) z dozidanimi trakti vzdolž Nazorjeve ulice in ob cerkvi Marijinega oznanenja, zidani po 1646.',
                startTime: '11:50',
                endTime: '12:20',
                sound: null,
                icon: '../assets/imgs/icon_church.svg'
            },
            {
                title: 'Semenišče - Ljubljanska Tržnica',
                description: '',
                startTime: '13:30',
                endTime: null,
                sound: null,
                icon: '../assets/imgs/icon_church.svg'
            }
        ]
    ];

}
