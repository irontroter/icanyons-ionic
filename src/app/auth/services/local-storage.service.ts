import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor( private storage: Storage ) { }

  clear() {
    this.storage.clear();
  }

  setUserAuth(value) {
    this.storage.set('userAuth', value);
  }
  setUser(value) {
    this.storage.set('user', value);
  }

  getUserAuth() {
    return this.storage.get('userAuth');
      // .then((userAuth) => {
      //   return userAuth;
      // });
  }
  getUser() {
    return this.storage.get('user');
      // .then((user) => {
      //   return user;
      // });
  }


  currentUserAuthLocalStorage() {

    // return JSON.parse(localStorage.getItem('userAuth'));

}

  currentUserLocalStorage() {

    // return JSON.parse(localStorage.getItem('user'));
  }

}
