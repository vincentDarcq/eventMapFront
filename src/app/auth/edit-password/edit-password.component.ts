import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit {

  public form: FormGroup;
  public error: string;
  email: string;
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email');
    this.form = this.fb.group({
      email: [this.email],
      oldPass: ['', Validators.required],
      newPass: ['', Validators.required]
    })
  }

  public submit(){
    this.authService.editPassword(this.form.value).subscribe( () => {
      this.router.navigate(['/']);
    }, err => {
      this.error = err.error;
    })
  }

}
