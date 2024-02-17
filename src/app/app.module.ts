import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthService } from './shared/services/authentication.service';
import { HomepageComponent } from './homepage/homepage.component';
import { ShareDataService } from './shared/services/user.service';
import { ShiftsComponent } from './shifts/edit-shift/shifts-update.component';
import { ProfileComponent } from './profile/profile.component';
import { MyShiftsComponent } from './shifts/my-shifts.component';
import { FutureShiftsComponent } from './shifts/future-shifts/future-shifts.component';
import { PastShiftsComponent } from './shifts/past-shifts/past-shifts.component';
import { ShiftService } from './shared/services/shift.service';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { ModalService } from './shared/services/modal.service';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomepageComponent,
    ShiftsComponent,
    ProfileComponent,
    MyShiftsComponent,
    FutureShiftsComponent,
    PastShiftsComponent,
    LandingPageComponent,
    NavbarComponent,
    ModalComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp({"projectId":"shiftbuilder-2f879","appId":"1:841166759868:web:099663eedd91776b292db9","storageBucket":"shiftbuilder-2f879.appspot.com","apiKey":"AIzaSyCX4VOGpzdLnVflR-vzm6cW9K9bGIY0IBY","authDomain":"shiftbuilder-2f879.firebaseapp.com","messagingSenderId":"841166759868"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [AuthService, ShareDataService, ShiftService, ModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
