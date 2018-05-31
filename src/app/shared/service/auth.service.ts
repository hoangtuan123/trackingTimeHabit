import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  constructor(public firebaseAuth: AngularFireAuth
    , private router: Router
  ) {
    this.user = firebaseAuth.authState;

    this.user.subscribe(
      (user) => {
        console.log('log user', user);
      }
    );

    this.firebaseAuth.authState.subscribe(res => {
      if (res && res.uid) {
        console.log('user is logged in');
      } else {
        console.log('user not logged in');
      }
    });

    this.firebaseAuth.auth.onAuthStateChanged(res => {
      console.log('res', res);
    });
  }

  signInWithGoogle() {
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
  }


  logout() {
    this.firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }
}
