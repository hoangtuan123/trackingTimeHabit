import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  public user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  constructor(public firebaseAuth: AngularFireAuth
    , private router: Router
  ) {
    this.user = firebaseAuth.authState;

    this.user.subscribe(
      user => {
        if (user)
          this.userDetails = user;
        else
          this.userDetails = null;
      }
    )
  }

  signInWithGoogle() {
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
  }


  logout() {
    return this.firebaseAuth.auth.signOut();
  }

  isLogin() {
    return this.userDetails ? true : false;
  }
}
