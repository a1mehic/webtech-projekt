import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.module';

@Injectable({ providedIn: 'root'})
export class AuthService {

  constructor(private http: HttpClient) {}

  createUser(email: string, passwort: string) {
    const authData: AuthData = {email, passwort};
    this.http.post('http://localhost:3000/user/signup', authData)
    .subscribe( response => {
      console.log(response);
    } );
  }
}
