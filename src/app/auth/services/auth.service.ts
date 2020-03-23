import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { __values } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userAuth: any;

  // user of firestore:
  user: any;

  constructor(
    private firebaseService: FirebaseService,
    private localStorageService: LocalStorageService,
    public afAuth: AngularFireAuth,
    private router: Router
  ) {
    console.log('auth.service: ');
    // this.afAuth.authState.subscribe(item => {
    //   if (item) {
    //     this.userAuth = item;
    //     firebaseService.getUser(item.uid)
    //       .subscribe( res => {
    //         this.user = res;
    //         console.log('1 userAuth', this.userAuth);
    //         console.log('2 user', this.user);
    //         this.localStorageService.clear();
    //         this.localStorageService.setUserAuth(this.userAuth);
    //         this.localStorageService.setUser(this.user);
    //       });

    //   } else {
    //     localStorage.setItem('userAuth', null);
    //     localStorage.setItem('user', null);
    //   }
    // });
  }

  docurrentUser() {
    return  this.afAuth.user;
  }

  doRegister(value: any) {

    return new Promise<any>((resolve, reject) => {
    this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
     .then(
       res => {
        this.doUpdateProfile ( value );
        // this.localStorageService.setUser( value );
        console.log('authService doRegister: ', res);
        // this.firebaseService.createUserData(res, value)
        //   .then(user => {
        //     console.log ('authService doRegister', user);
        //     resolve (user);
        //   });
        resolve (this.firebaseService.createUserData(res, value));
       },
       err => reject(err));
   });
  }

  doUpdateProfile(value: any) {

    return new Promise<any>((resolve, reject) => {
    this.afAuth.auth.onAuthStateChanged((userAuth) => {

      if (userAuth) {
      resolve (userAuth.updateProfile({
        displayName: value.displayName,
        photoURL: value.photoURL
        })
      );
    } else {
      resolve();
    }
   });
  });
  }

  doUpdateEmail( value) {

  return new Promise<any>((resolve, reject) => {
  this.afAuth.auth.onAuthStateChanged((userAuth) => {
    if (userAuth) {
    resolve (userAuth.updateEmail(value.email));
  } else {
    resolve();
  }
 });
});
}

  doUpdatePassword( value ) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.onAuthStateChanged((userAuth) => {
        if (userAuth) {
        resolve (userAuth.updatePassword(value));
      } else {
        resolve();
      }
     });
    });
  }

  doLogin(value) {
   return new Promise<any>((resolve, reject) => {
    this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err));
   });
  }

  doRecover(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        resolve(
          // portar al loginPage
          this.router.navigate(['/login'])
        );
      }).catch((error) => {
        console.log(error);
        reject();
      });
    });
  }
}
