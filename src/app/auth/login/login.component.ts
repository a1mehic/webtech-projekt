import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  isLoading = false;

  constructor(public authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  onLogin(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      this.snackBar.open('Wrong User', 'Close', {
        duration: 3000,
        panelClass: ['errorPopup']
      }); 
      this.router.navigate(['/']);
      return;
    }
    this.authService.login(form.value.email, form.value.passwort);
    this.router.navigate(['/']);
  }
}
