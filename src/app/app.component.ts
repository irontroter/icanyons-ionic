import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalStorageService } from './auth/services/local-storage.service';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from './interfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  user: User;
  uid: string;

  appPages: Array<{title: string, url: string, icon: string}>;

   constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router,
    private menu: MenuController
  ) {
    console.log('app.component: ');

    // if (checkUser) {
    //    this.user = checkUser;
    //    this.uid = checkUser.uid;
    //    } else {
    //     this.user = null;
    //    }


    this.initializeApp();
  }

   charge() {
    console.log('ionWillOpen............');
    this.localStorageService.getUser()
      .then( (checkUser: User) => {
        console.log('checkuser... ');
        console.log('checkUser: ', checkUser);
        if (checkUser) {
          this.user = checkUser;
          this.uid = checkUser.uid;
          this.appPages = [
            {
              title: 'Profile',
              url: '/profile/' + this.uid,
              icon: 'contact'
            },
            {
              title: 'Home',
              url: '/home',
              icon: 'home'
            },
            {
              title: 'List',
              url: '/list',
              icon: 'list'
            }
          ];
          } else {
           this.user = null;
          }
      });
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  tryLogout() {
    this.authService.doLogout();
    this.menu.close('first');
    this.localStorageService.clear();
    this.router.navigate(['/login']);
  }

}
