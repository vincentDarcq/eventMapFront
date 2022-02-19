import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  form: FormGroup;
  error: string;
  picture: FormData;
  subSignup: Subscription;
  subPicture: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.picture = new FormData();
    this.form = this.fb.group({
      email: [''],
      name: [''],
      password: [''],
      profile_type: [''],
    });
  }

  onPicture(event) {
    if (event.target.files[0]) {
      this.picture.append('picture', event.target.files[0], event.target.files[0].name);
    }
  }

  public submit() {
    this.subSignup = this.authService.signup(this.form.value).subscribe((user: User) => {
      if (this.picture.get('picture')) {
        this.subPicture = this.userService.uploadProfilePicture(user.name, this.picture).subscribe(() => {
          this.router.navigate(['/signin']);
        })
      } else {
        this.router.navigate(['/signin']);
      }
    }, err => {
      this.error = err.error;
    })
  }

  ngOnDestroy(): void {
    if (this.subSignup) { this.subSignup.unsubscribe(); }
    if (this.subPicture) { this.subPicture.unsubscribe(); }
  }
}
