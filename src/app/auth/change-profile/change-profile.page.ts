import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LocalStorageService } from '../services/local-storage.service';


@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.page.html',
  styleUrls: ['./change-profile.page.scss'],
})
export class ChangeProfilePage implements OnInit {

  uidProfile: string;
  userProfile: Observable<User>;
  user: User = {
    uid: '',
    email: '',
    photoURL: '',
    displayName: '',
    bio: '',
    location: '',
    role: 'basic',
    pro: {
    contact: '',
    img: '',
    paypal: '',
    isActiveted: false
    },
    canyonsFav: []
  };

  profileUrl = '';

  validationsForm: FormGroup;
  errorMessage = '';

  validationMessages = {
     email: [
       { type: 'required', message: 'Email is required.' },
       { type: 'pattern', message: 'Please enter a valid email.' }
     ],
     displayName: [
       { type: 'required', message: 'Usernme is required.' },
       { type: 'minlength', message: 'Username must be at least 2 characters long.' }
       ],
     location: [
       { type: 'minlength', message: 'Location must be at least 2 characters long.' }
    ],
      bio: [
       { type: 'minlength', message: 'Biography must be at least 5 characters long.' }
    ]
   };

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private firebaseService: FirebaseService,
              private authService: AuthService,
              private localStorageService: LocalStorageService,
              private formBuilder: FormBuilder,
              private camera: Camera) {
  console.log('change-profile.page: ');
  this.validationsForm = this.formBuilder.group({
    email: new FormControl( '', Validators.compose([
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
  ])),
    displayName: new FormControl('', Validators.compose([
    Validators.minLength(2),
    Validators.required
  ])),
    location: new FormControl('', Validators.compose([
    Validators.minLength(2),
    // Validators.required
  ])),
    bio: new FormControl('', Validators.compose([
    Validators.minLength(5),
    // Validators.required
  ])),
});

   }


  ngOnInit() {
    this.uidProfile = this.activatedRoute.snapshot.paramMap.get('uid');
    this.userProfile = this.firebaseService.getUser( this.uidProfile );
    this.userProfile.subscribe( user => {
    console.log('user chanche-profile.page', user);

    this.validationsForm.get('email').setValue(user.email);
    // this.validationsForm.get('photoURL').setValue(user.photoURL);
    this.validationsForm.get('displayName').setValue(user.displayName);
    if (user.bio) {
      this.validationsForm.get('bio').setValue(user.bio);
    }
    if (user.location) {
      this.validationsForm.get('location').setValue(user.location);
    }

    this.profileUrl = user.photoURL;

    this.user.uid = user.uid;
    this.user.email = user.email;
    this.user.photoURL = user.photoURL;
    this.user.displayName = user.displayName;
    this.user.bio = user.bio;
    this.user.location = user.location;

    });
  }

  async takePicture() {
    const options: CameraOptions = {
      quality: 15,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };

    try {
      const cameraInfo = await this.camera.getPicture(options);
      const blobInfo = await this.firebaseService.makeFileIntoBlob(cameraInfo, 'profile.jpg');
      const uploadInfo: any = await this.firebaseService.uploadToFirebase(`/users/${this.uidProfile}/profilePicture/`, blobInfo);
      this.firebaseService.downLoadToFirebase(`/users/${this.uidProfile}/profilePicture/profile.jpg`)
      .subscribe(path => {
          this.firebaseService.updateUser(this.uidProfile, {photoURL: path});
          this.profileUrl = path;
          this.firebaseService.getUser(this.uidProfile).subscribe( user => {
            this.localStorageService.setUser(user);
          });
        });

      alert('Photo Upload Success');

    } catch (e) {
      console.log(e.message);
      alert('File Upload Error');
    }
  }
  //  end takePicture

  tryEditProfile(isClicked: boolean, isValid: boolean, value: any) {
    console.log(isClicked);
    console.log(isValid);
    console.log(value);
    console.log(value.displayName);
    console.log(this.user.displayName);
    // console.log(validationForm);

    if (isClicked && isValid) {

     let doUpdateFirebase: boolean;
     doUpdateFirebase = false;

     if (value.displayName !== this.user.displayName) {
      //  change username
      this.authService.doUpdateProfile( value);
      doUpdateFirebase = true;

      }
     if (value.email !== this.user.email) {
      //  change email
      this.authService.doUpdateEmail( value );
      doUpdateFirebase = true;

      }
     if (value.location !== this.user.location || value.bio !== this.user.bio ) {
      // set location i/o set bio
      doUpdateFirebase = true;
      }
     if ( doUpdateFirebase === true ) {
      this.firebaseService.updateUser( this.user.uid, value)
      doUpdateFirebase = false;
     }

     this.router.navigate([`/profile/${this.uidProfile}`]);
  } else {
    return;
  }
}
}
