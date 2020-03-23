import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validationsForm: FormGroup;
  errorMessage = '';

  validationMessages = {
   email: [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Please enter a valid email.' }
   ],
   password: [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 5 characters long.' }
   ]
 };

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    console.log('login.page: ');
   }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  tryLogin(value) {
    this.authService.doLogin(value)
    .then(res => {
      // res és userAuth.... trobar user...firebaseService (res.uid)
      console.log('tryLogin: ', res);
      this.firebaseService.getUser(res.user.uid)
        .subscribe(user => {
          console.log('userrrrrrrrrrrr', user);
          this.localStorageService.setUser (user);
          this.localStorageService.setUserAuth (res.user);
          this.router.navigate(['/home']);
        });

    }, err => {
      this.errorMessage = err.message;
      console.log(err);
    });
  }

  goRegisterPage() {
    this.router.navigate(['/register']);
  }

  getUsersLocalStorage() {
    const user = this.localStorageService.currentUserLocalStorage();
    const userAuth = this.localStorageService.currentUserAuthLocalStorage();

    console.log('user: ', user);
    console.log('userAuth: ', userAuth);
  }

  goProba() {
    this.authService.docurrentUser().subscribe( res => {
      console.log(res);
    });
  }
  }

