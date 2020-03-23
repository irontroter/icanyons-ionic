import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
// import { AuthService } from './services/auth.service';
// import { FirebaseService } from './services/firebase.service';
// import { LocalStorageService } from './services/local-storage.service';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AngularFirestoreModule, // imports firebase/firestore
    AngularFireAuthModule, // imports firebase/auth
    AngularFireStorageModule // imports firebase/storage
  ],
  providers: [
    // AuthService,
    // FirebaseService,
    // LocalStorageService,
    Camera,
    File,
    // { provide: StorageBucket, useValue: 'gs://icanyons.appspot.com' }
    ],
  exports: [
  ]
})
export class AuthModule { }
