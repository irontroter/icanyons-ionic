import { Component } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { LocalStorageService } from '../../auth/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('home.page: ');
  }

  // goProba() {
  //   this.authService.docurrentUser().subscribe( res => {
  //     console.log(res);
  //   });
  // }
  getUsersLocalStorage() {
    // const user = this.localStorageService.currentUserLocalStorage();
    // const userAuth = this.localStorageService.currentUserAuthLocalStorage();
    this.localStorageService.getUser()
        .then( user => {
          console.log('user: ', user);
        });
    this.localStorageService.getUserAuth()
        .then( userAuth => {
          console.log('userAuth: ', userAuth);
        });

    // console.log('user: ', user);
    // console.log('userAuth: ', userAuth);
  }
  tryLogout() {
    this.authService.doLogout();
    // this.menu.close('first');
    this.localStorageService.clear();
    this.router.navigate(['/login']);
  }
}
