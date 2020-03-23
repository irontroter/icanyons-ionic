import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  validationsForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  passwordType = 'password';
  passwordShown = false;

  validationMessages = {
    username: [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 2 characters long.' }
    ],
   email: [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Enter a valid email.' }
   ],
   password: [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 5 characters long.' },
     { type: 'maxlength', message: 'Password must be maximum of 30 characters long.' }
   ],
   confirmPassword: [
    { type: 'required', message: 'confirm password is required.' },
    { type: 'minlength', message: 'Password must be at least 5 characters long.' },
    { type: 'maxlength', message: 'Password must be maximum of 30 characters long.' }
   ]
  };

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.minLength(2),
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(30),
        Validators.required
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(30),
        Validators.required
      ])),
    }, {
      validators: this.password.bind(this)
    });
  }

  password(formGroup: FormGroup){
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmPassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  passwordToogle() {
    if (this.passwordShown) {
      this.passwordShown = false;
      this.passwordType = 'password';
    } else {
      this.passwordShown = true;
      this.passwordType = 'text';
    }
  }

  tryRegister(value) {

    this.authService.doRegister(value)
     .then(res => {

       console.log('tryregister: ', res);
       this.errorMessage = '';
       this.successMessage = 'Your account has been created. Please log in.';

       this.localStorageService.clear();
       this.localStorageService.setUser(res);
       this.localStorageService.setUserAuth(res);
       this.router.navigate(['/home']);
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = '';
     });
  }

  goLoginPage(){
    this.router.navigate(['/login']);
  }

}
