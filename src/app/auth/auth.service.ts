import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.module';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';


@Injectable({ providedIn: 'root'})
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private mail: string;
  private username: string;

  constructor(private http: HttpClient, private router: Router, public snackBar: MatSnackBar) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  getUsername(){
    return this.username;
  }

  createUser(username: string, email: string, passwort: string) {
    const authData: AuthData = {username, email, passwort};
    this.http.post('http://localhost:3000/user/signup', authData)
    .subscribe( response => {
      this.snackBar.open('You are now signed up!', 'Close', {
        duration: 3000,
        panelClass: ['successPopup']
      });
      this.router.navigate(['login']);
    }, error => {
      this.snackBar.open('Sign-Up failed', 'Close', {
        duration: 3000,
        panelClass: ['errorPopup']
      });
      this.router.navigate(['/']);
    });
  }

  login(email: string, passwort: string, username:string = "dummy") {
    this.mail = email;

    const authData: AuthData = {username, email, passwort};
    this.http.post<{ token: string, expiresIn: number, userId: string, username: string }>('http://localhost:3000/user/login', authData)
      .subscribe( response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.username = response.username;
          console.log(expirationDate);
          this.saveAuthData(this.username, token, expirationDate, this.userId);
          this.router.navigate(['/']);
          
        }
      }, error => {
        this.snackBar.open('Wrong User', 'Close', {
          duration: 3000,
          panelClass: ['errorPopup']
        }); 
      })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.username = authInformation.username;
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);    // setTimeout arbeitet in Millisekunden und nicht Sekunden
  }

  private saveAuthData(username: string, token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());    // ISOString Standardversion fürs Datum
    localStorage.setItem('userId', userId);

  }

  private clearAuthData() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
      username
    };
  }
}
