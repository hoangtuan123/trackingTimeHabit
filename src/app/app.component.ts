import { Component } from '@angular/core';
import { AuthService } from './shared/service/auth.service';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private authService: AuthService
    , private router: Router
    , private db: AngularFireDatabase
  ) {

  }

  signInWithGoogle() {
    this.authService.signInWithGoogle().then(
      data => {
        this.router.navigate(['/habits']);
      },
      error => {
        console.log('error promise', error);
      });
  }

  logout() {
    this.authService.logout();
  }
}
