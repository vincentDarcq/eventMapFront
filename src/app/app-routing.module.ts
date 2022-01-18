import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventFormComponent } from './event-form/event-form.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { MainComponent } from './main/main.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { OtherProfileComponent } from './other-profile/other-profile.component';
import { EditPasswordComponent } from './auth/edit-password/edit-password.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'createEvent', component: EventFormComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent },
  { path: 'otherProfile', component: OtherProfileComponent },
  { path: 'eventDetail', component: EventDetailComponent },
  { path: 'editPass', canActivate: [AuthGuard], component: EditPasswordComponent },
  { path: '**', component: MainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
