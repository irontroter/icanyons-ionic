import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { User } from '../../interfaces/user.interface';
import { FirebaseService } from '../services/firebase.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

userVisiter: any;
userProfile: User;
uidProfile: string;
isMyProfile: boolean;

value = {
  email : '',
  password : '',
  displayName : '',
  photoURL: '',
  phone: '',
  location: '',
  bio: ''
};

  error: string;
  userWantsToSignup = false;
  linkError = '';

  constructor(
    private toastController: ToastController,
    public loadingController: LoadingController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private localStorageService: LocalStorageService
  ) {
    console.log('profile.page: ');
  }

  ngOnInit() {
    // this.userVisiter = this.localStorageService.currentUserLocalStorage();
    this.localStorageService.getUser()
      .then( userVisiter => {
    this.userVisiter = userVisiter;
    this.uidProfile = this.activatedRoute.snapshot.paramMap.get('uid');
    console.log('uidProfile: ', this.uidProfile);
    this.firebaseService.getUser( this.uidProfile ).subscribe(user => {
    this.userProfile = user;

    console.log('userProfile: ', user);
    console.log('userVisiter: ', this.userVisiter);
    if (this.userVisiter.uid === this.userProfile.uid){
      this.isMyProfile = true;
      } else {
      this.isMyProfile = false;
      }
    });
   });
  }


  // tryUpdateEmail() {
  //   this.authService.doUpdateEmail(this.value)
  //     .then(() => {
  //       this.firebaseService.updateProfile({email: this.value.email});
  //       this.userProfile.email = this.value.email;
  //       this.value.email = '';
  //       this.presentToast('Email updated', false, 'bottom', 1000);
  //       this.error = '';
  //     })
  //     .catch(err => {
  //       console.log(`failed ${err}`);
  //       this.error = err.message;
  //     });
  // }

  // tryUpdateUsername() {
  //   this.authService.doUpdateProfile( this.value )
  //     .then((data) => {
  //       this.firebaseService.updateProfile({displayName: this.value.displayName});
  //       this.userProfile.displayName = this.value.displayName;
  //       this.value.displayName = '';
  //       this.presentToast('Username updated', false, 'bottom', 1000);
  //       this.error = '';
  //     })
  //     .catch(err => {
  //       console.log(` failed ${err}`);
  //       this.error = err.message;
  //     });
  // }

  // tryUpdateImage() {

  //   this.authService.doUpdateProfile({
  //     photoURL: `https://picsum.photos/id/${this.value.photoURL}/200/200`
  //   })
  //     .then((data) => {
  //       this.firebaseService.updateProfile({photoURL: this.value.photoURL});
  //       this.userProfile.photoURL = this.value.photoURL;
  //       this.value.photoURL = '';
  //       this.presentToast('Image updated', false, 'bottom', 1000);
  //       this.error = '';
  //     })
  //     .catch(err => {
  //       console.log(` failed ${err}`);
  //       this.error = err.message;
  //     });
  // }

  //  tryUpdatePassword() {
  //   this.authService.doUpdatePassword(this.value.password)
  //     .then(() => {

  //       this.value.password = '';
  //       this.presentToast('Password updated', false, 'bottom', 1000);
  //       this.error = '';
  //     })
  //     .catch(err => {
  //       console.log(` failed ${err}`);
  //       this.error = err.message;
  //     });
  // }

   async presentToast(message, showButton, position, duration) {
    const toast = await this.toastController.create({
      message,
      showCloseButton: showButton,
      position,
      duration
    });
    toast.present();
  }

}
