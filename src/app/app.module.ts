//Composants
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventFormComponent } from './event-form/event-form.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { EventComponent } from './event/event.component';
import { MainComponent } from './main/main.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { OtherProfileComponent } from './other-profile/other-profile.component';
import { EditPasswordComponent } from './auth/edit-password/edit-password.component';
import { EventChatComponent } from './event-chat/event-chat.component';

//Material
import { AngularMaterialModule } from './material/angular-material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

//Services
import { AuthService } from './shared/services/auth.service';
import { ChatService } from './shared/services/chat.service';
import { EventService } from './shared/services/event.service';
import { EventsApiService } from './shared/services/events-api.service';
import { GeoService } from './shared/services/geo.service';
import { UserService } from './shared/services/user.service';

//gard & interceptor http requests
import { AuthGuard } from './shared/guards/auth.guard';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';

//Modules
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider } from 'angularx-social-login';

//Date française
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

//Carte leaflet
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FriendListComponent } from './friend-list/friend-list.component';
import { FriendChatComponent } from './friend-chat/friend-chat.component';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';

//emojis
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    EventListComponent,
    EventFormComponent,
    SigninComponent,
    SignupComponent,
    HeaderComponent,
    ProfileComponent,
    EventComponent,
    MainComponent,
    EventDetailComponent,
    OtherProfileComponent,
    EditPasswordComponent,
    EventChatComponent,
    FriendListComponent,
    FriendChatComponent,
    SanitizeHtmlPipe,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    NgxMaterialTimepickerModule,
    SocialLoginModule,
    PickerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      //multi à true pour préciser qu'il y a d'autres elements à provide ensuite
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    GeoService,
    AuthService,
    AuthGuard,
    UserService,
    EventService,
    EventsApiService,
    ChatService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('896161427840233')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
