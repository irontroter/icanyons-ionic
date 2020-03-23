import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
// import 'firebase/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../../interfaces/user.interface';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { File } from '@ionic-native/file/ngx';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private snapshotChangesSubscription: any;
  private userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private file: File
  ) {
    console.log('firebase.service: ');
  }

  getUser( userId ) {
    this.userDoc = this.afs.doc<User>(`users/${userId}`);
    return this.userDoc.valueChanges();
  }

  updateUser( userId, value ) {
    this.userDoc = this.afs.doc<User>(`users/${userId}`);
    this.userDoc.update(value);
  }

  getTasks() {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if (currentUser) {
          this.snapshotChangesSubscription = this.afs.collection('people').doc(currentUser.uid).collection('tasks').snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      });
    });
  }

  getTask(taskId) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if (currentUser) {
          this.snapshotChangesSubscription = this.afs.doc<any>('people/' + currentUser.uid + '/tasks/' + taskId).valueChanges()
          .subscribe(snapshots => {
            resolve(snapshots);
          }, err => {
            reject(err);
          });
        }
      });
    });
  }

  unsubscribeOnLogOut() {
    // remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }



// FILE STUFF
makeFileIntoBlob(imagePath, filename) {
  // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
  return new Promise((resolve, reject) => {
    let fileName = '';
    this.file
      .resolveLocalFilesystemUrl(imagePath)
      .then(fileEntry => {
        const { name, nativeURL } = fileEntry;

        // get the path..
        const path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));
        console.log('path', path);
        console.log('fileName', name);

        // canvi de nom de l'arxiu
        // fileName = name;
        fileName = filename;


        // we are provided the name, so now read the file into
        // a buffer
        return this.file.readAsArrayBuffer(path, name);
      })
      .then(buffer => {
        // get the buffer and make a blob to be saved
        const imgBlob = new Blob([buffer], {
          type: 'image/jpeg'
        });
        console.log(imgBlob.type, imgBlob.size);
        resolve({
          fileName,
          imgBlob
        });
      })
      .catch(e => reject(e));
  });
}


uploadToFirebase(path, imageBlobInfo) {
  console.log('uploadToFirebase');
  return new Promise((resolve, reject) => {
    const fileRef = firebase.storage().ref().child(path + imageBlobInfo.fileName);

    const uploadTask = fileRef.put(imageBlobInfo.imgBlob);

    uploadTask.on(
      'state_changed',
      (snapshot: any) => {
        console.log(
          'snapshot progess ' +
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      error => {
        console.log(error);
        reject(error);
      },
      () => {
        // completion...
        resolve(uploadTask.snapshot);
      }
    );
  });
}

downLoadToFirebase(path: string) {
  const ref = this.storage.ref(path);
  return ref.getDownloadURL();
}



  // updateTask(taskKey, value) {
  //   return new Promise<any>((resolve, reject) => {
  //     const currentUser = firebase.auth().currentUser;
  //     this.afs.collection('people').doc(currentUser.uid).collection('tasks').doc(taskKey).set(value)
  //     .then(
  //       res => resolve(res),
  //       err => reject(err)
  //     );
  //   });
  // }

  // deleteTask(taskKey) {
  //   return new Promise<any>((resolve, reject) => {
  //     const currentUser = firebase.auth().currentUser;
  //     this.afs.collection('people').doc(currentUser.uid).collection('tasks').doc(taskKey).delete()
  //     .then(
  //       res => resolve(res),
  //       err => reject(err)
  //     );
  //   });
  // }

  // createTask(value) {
  //   return new Promise<any>((resolve, reject) => {
  //     const currentUser = firebase.auth().currentUser;
  //     this.afs.collection('people').doc(currentUser.uid).collection('tasks').add({
  //       title: value.title,
  //       description: value.description,
  //       image: value.image
  //     })
  //     .then(
  //       res => resolve(res),
  //       err => reject(err)
  //     );
  //   });
  // }

  // encodeImageUri(imageUri, callback) {
  //   const c = document.createElement('canvas');
  //   const ctx = c.getContext('2d');
  //   const img = new Image();
  //   img.onload = function() {
  //     const aux: any = this;
  //     c.width = aux.width;
  //     c.height = aux.height;
  //     ctx.drawImage(img, 0, 0);
  //     const dataURL = c.toDataURL('image/jpeg');
  //     callback(dataURL);
  //   };
  //   img.src = imageUri;
  // }

  // uploadImage(imageURI, randomId) {
  //   return new Promise<any>((resolve, reject) => {
  //     const storageRef = firebase.storage().ref();
  //     const imageRef = storageRef.child('image').child(randomId);
  //     this.encodeImageUri(imageURI, (image64) => {
  //       imageRef.putString(image64, 'data_url')
  //       .then(snapshot => {
  //         snapshot.ref.getDownloadURL()
  //         .then(res => resolve(res));
  //       }, err => {
  //         reject(err);
  //       });
  //     });
  //   });
  // }

// =============================================================
// pujar arxiu img al Storage
// =============================================================
doUploadFile( file , uid) {
    // const file = event.target.files[0];
    const filePath = `/users/photoURL/${uid}`;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
  }

// ===========================================================
// Sets user data to firestore after succesful login
// ===========================================================

createUserData( userAuth, value ) {

 if (value) {
  return new Promise<any>((resolve, reject) => {
  console.log('firebaseService value', value);
  console.log('firebaseService currentUser', userAuth);
  const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${userAuth.user.uid}`);
  const data: User = {
        uid: userAuth.user.uid,
        email: userAuth.user.email,
        displayName: value.username,
        photoURL: userAuth.user.photoURL,
        role: 'basic',
        canyonsFav: []
        };
  userRef.set(data)
  .then(
    res => resolve(res),
    err => reject(err)
  );
 });
 }


//  if (value ) {
    // const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${userAuth.user.uid}`);
    // const data: User = {
    //     uid: userAuth.user.uid,
    //     email: userAuth.user.email,
    //     displayName: value.username,
    //     photoURL: userAuth.user.photoURL,
    //     role: 'basic',
    //     canyonsFav: []
    //     };
    // userRef.set(data);

//     console.log('data', data);

//       // 4/11/2019
//     return data;
//     }
  }

  updateProfile(  value ) {

    return new Promise<any>((resolve, reject) => {
      // const currentUser = firebase.auth().currentUser;
      const currentUser = firebase.auth().currentUser;

      this.afs.collection('users').doc(currentUser.uid).update(value)
      .then(
        res => resolve(res),
        err => reject(err)
      );
     });
     }

}
