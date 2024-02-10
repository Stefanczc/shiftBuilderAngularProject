import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../shared/interfaces/user.model';
import { birthdateValidator, emailValidator, passwordValidator } from '../../shared/validators/validators';
import { ShareDataService } from '../../shared/services/share-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTE_ADMIN_ALLWORKERS, ROUTE_LOGIN, ROUTE_MYSHIFTS } from '../../app-routing.module';
import { collection } from 'firebase/firestore';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { ModalService } from 'src/app/shared/services/modal.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { AuthService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-admin-workers-update',
  templateUrl: './admin-workers-update.component.html',
  styleUrls: ['./admin-workers-update.component.scss']
})
export class AdminWorkersUpdateComponent implements OnInit {

  workerForm: FormGroup;
  users: User[] = [];
  user: any;
  uid: string = '';


  constructor(
    private fb: FormBuilder,
    private shareDataService: ShareDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firestore: Firestore,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) { 
    this.workerForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, emailValidator()]],
      password: [{ value: '', disabled: true }, [Validators.required, passwordValidator()]],
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      birthdate: ['', [Validators.required, birthdateValidator()]],
    })
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.uid = params['uid'];
      if (this.uid) {
        this.shareDataService.getUserByUid(this.uid)
          .then(user => {
            if (user) {
              this.user = user;
              this.initializeForm();
            } else {
              console.error('User not found for ID:', this.uid);
            }
          })
          .catch(error => {
            console.error('Error fetching user details:', error);
          });
      }
    });
  }

  initializeForm(): void {
    this.workerForm.patchValue({
      email: this.user?.email || '',
      password: this.user?.password || '',
      firstname: this.user?.firstname || '',
      lastname: this.user?.lastname || '',
      birthdate: this.user?.birthdate || '',
    });
  }

  updateWorker() {
    if (this.workerForm.valid) {
      const updatedUserData = this.workerForm.value;
      const userId = this.activatedRoute.snapshot.paramMap.get('uid');
  
      if (userId) {
        const usersCollection = collection(this.firestore, 'users');
        const userDoc = doc(usersCollection, userId);
        const updatedData = { ...this.user, ...updatedUserData };
  
        updateDoc(userDoc, updatedData)
          .then(() => {
            this.user = updatedData;
            this.shareDataService.setUserData(updatedData);
            this.loadingService.showForDuration(2000);
            this.modalService.openModal('Success', 'Profile was successfully updated!', 'success');
            this.navigateToAllWorkers();
          })
          .catch(error => {
            console.error('Error updating worker:', error);
          });
      } else {
        console.error('No userId found in the URL path');
      }
    } else {
      console.error('Form validation failed');
    }
  }

  async removeWorker(): Promise<void> {
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

  navigateToAllWorkers() {
    this.router.navigate([`/${ROUTE_ADMIN_ALLWORKERS}`]);
  }

  navigateToMyShifts() {
    this.router.navigate([`/${ROUTE_MYSHIFTS}`, this.uid]);
  }

}
