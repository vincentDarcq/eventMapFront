import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, SocialAuthService } from "angularx-social-login";
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  form: FormGroup;
  error: string;
  socialUser: SocialUser = new SocialUser();
  user: User;
  loggedIn: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private authSocialService: SocialAuthService,
    private userService: UserService
  ) {
    this.user = new User();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [''],
      password: ['']
    });
    this.authSocialService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = (user != null);
    });
  }

  public submit() {
    this.authService.signin(this.form.value).subscribe(() => {
      this.userService.setCurrentUser();
      this.router.navigate(['/']);
    }, err => {
      this.error = err.error;
    })
  }

  signInWithFB(): void {
    this.authSocialService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut() {
    this.authSocialService.signOut();
  }

}
