import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShareDataService } from '../shared/services/share-data.service';
import { ROUTE_HOMEPAGE, ROUTE_LOGIN } from '../app-routing.module';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { birthdateValidator, emailValidator, passwordValidator } from '../shared/validators/validators';
import { ModalService } from '../shared/services/modal.service';
import { LoadingService } from '../shared/services/loading.service';
import { AuthService } from '../shared/services/authentication.service';
import { getAuth, updatePassword } from 'firebase/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any;
  profileForm!: FormGroup;

  constructor(
    private router: Router,
    private sharedDataService: ShareDataService,
    private fb: FormBuilder,
    private firestore: Firestore,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, emailValidator()]],
      password:['', [Validators.required, passwordValidator()]],
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      birthdate: ['', [Validators.required, birthdateValidator()]],
    });
  }

  ngOnInit(): void {
    this.sharedDataService.userData.subscribe((userValue) => {
      this.user = userValue;
      this.initializeForm();
    });
  }
  
  initializeForm(): void {
    this.profileForm.patchValue({
      email: this.user?.email || '',
      password: this.user?.password || '',
      firstname: this.user?.firstname || '',
      lastname: this.user?.lastname || '',
      birthdate: this.user?.birthdate || '',
      passwordConfirm: this.user?.password || ''
    });
  }

  async updateProfile() {
    if (this.profileForm.valid) {
      const updatedUserData = this.profileForm.value;
      const userId = this.user.uid;

      const userCollection = collection(this.firestore, 'users');
      const userRef = doc(userCollection, userId);
      

      const passwordConfirmValue = updatedUserData.password ? updatedUserData.password : '';
      const updatedData = { ...this.user, ...updatedUserData, passwordConfirm: passwordConfirmValue };
  
      try {
        await updateDoc(userRef, updatedData);
        const auth = getAuth();
        const currentUser = auth.currentUser;

      // const userDoc = await getDoc(userRef);
      // const userData = userDoc.data();
        // const credential = EmailAuthProvider.credential(userData?.['email'], userData?.['password']);
        // await reauthenticateWithCredential(currentUser!, credential);
        // if (currentUser !== null && updatedUserData.email) {
        //   await updateEmail(currentUser, updatedUserData.email);
        // }
  
        if (updatedUserData.password && currentUser !== null) {
          await updatePassword(currentUser, updatedUserData.password);
        }
  
        this.user = updatedData;
        this.sharedDataService.setUserData(updatedData);
        this.loadingService.showForDuration(2000);
        this.modalService.openModal('Success', 'Profile updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating profile:', error);
        this.modalService.openModal('Error', 'Failed to update profile. Please try again.', 'danger');
      }
    } else {
      console.error('Form validation failed');
      this.modalService.openModal('Error', 'Failed to update profile. Please try again.', 'danger');
    }
  }
  
  async removeUser(): Promise<void> {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) {
      return;
    }
    try {
      const userId = this.user.uid;
      const userCollection = collection(this.firestore, 'users');
      const userRef = doc(userCollection, userId);
      await updateDoc(userRef, { isDisabled: true });
      this.logout();
    } catch (error) {
      console.error('Error disabling user:', error);
      this.modalService.openModal('Error', 'Failed to disable user. Please try again.', 'danger');
    }
  }

  logout() {
    this.authService.logout();
    this.loadingService.showForDuration(1000);
    this.router.navigate([`${ROUTE_LOGIN}`]);
  }
  
  navigateToHomepage(): void {
    this.router.navigate([`/${ROUTE_HOMEPAGE}`]);
  }

}
