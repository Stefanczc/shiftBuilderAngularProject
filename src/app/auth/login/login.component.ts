import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/authentication.service';
import { emailValidator, passwordValidator } from '../../shared/validators/validators';
import { ShareDataService } from '../../shared/services/share-data.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { LoadingService } from 'src/app/shared/services/loading.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoggedIn = false;
  showForgotPasswordForm = false;
  isModalVisible: boolean = false; 
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore, 
    private authService: AuthService,
    private sharedDataService: ShareDataService,
    private modalService: ModalService,
    private loadingService: LoadingService
  ) {
    this.loginForm = this.fb.group({
      email: ['fane@email.ro', [Validators.required, emailValidator()]],
      password: ['abc123$', [Validators.required, Validators.minLength(6), passwordValidator()]]
    });
  }

  ngOnInit() {
    const loginFormData = this.sharedDataService.getLoginFormData();
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
    if (loginFormData) {
      this.loginForm.setValue({
        email: loginFormData.email,
        password: loginFormData.password,
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm)
        .then(() => {
          this.loadingService.showForDuration(2000);
          this.modalService.openModal('Success', 'Welcome to E-shift!', 'success');
        })
        .catch(error => {
          const errorMessage = error.message;
          if (errorMessage.includes('auth/invalid-credential')) {
            this.modalService.openModal('Error', 'Your account is not in our database', 'error');
          }
          else if (errorMessage.includes('User is disabled')) {
            this.modalService.openModal('Error', 'Your account has been disabled, please contact the support team', 'error');
          }
          else {
            this.modalService.openModal('Error', 'Please refresh the page and try again', 'error');
          }
        });
    } else {
      this.modalService.openModal('Error', 'Please enter valid credentials', 'error');
    }
  }  

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
