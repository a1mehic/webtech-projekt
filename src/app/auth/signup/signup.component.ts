import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isLoading = false;

  constructor(public authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  onSignup(form: NgForm) {
    if (form.invalid) {
      this.snackBar.open('Sign-Up failed!', 'Close', {
        duration: 3000,
        panelClass: ['errorPopup']
      }); 
      this.router.navigate(['/']);
      return;
    } else {
      this.isLoading = true;
      this.authService.createUser(form.value.username, form.value.email, form.value.passwort);
      this.userId = this.authService.getUserId();
    }
  }
}
