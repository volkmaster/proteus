import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { QRScanner } from '@ionic-native/qr-scanner';
import { NativeAudio } from '@ionic-native/native-audio';
import { AndroidPermissions } from '@ionic-native/android-permissions';

// Services
import { AuthService } from '../providers/auth.service';
import { EnvironmentService } from '../providers/environment.service';
import { HttpService } from '../providers/http.service';
import { RequestService } from '../providers/request.service';
import { RouteService } from '../providers/route.service';
import { GeoService } from '../providers/geo.service';
import { LocalStorageService } from '../providers/local-storage.service';
import { ToastService } from '../providers/toast.service';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { FiltersPage } from '../pages/filters/filters';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { DetailsPage } from '../pages/details/details';
import { MapsPage } from '../pages/maps/maps';
import { QrCodePage } from '../pages/qr-code/qr-code';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

// Components
import { HeaderComponent } from '../components/header/header.component';
import { ListComponent } from '../components/list/list.component';

// Interceptors
import { TokenInterceptor } from '../providers/token.interceptor';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        HeaderComponent,
        FiltersPage,
        DashboardPage,
        ListComponent,
        DetailsPage,
        MapsPage,
        QrCodePage,
        LoginPage,
        RegisterPage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        FiltersPage,
        HeaderComponent,
        DashboardPage,
        ListComponent,
        DetailsPage,
        MapsPage,
        QrCodePage,
        LoginPage,
        RegisterPage
    ],
    providers: [
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        SplashScreen,
        StatusBar,
        Geolocation,
        LaunchNavigator,
        QRScanner,
        NativeAudio,
        AndroidPermissions,
        AuthService,
        EnvironmentService,
        HttpService,
        RequestService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        RouteService,
        GeoService,
        LocalStorageService,
        ToastService
    ]
})
export class AppModule { }
