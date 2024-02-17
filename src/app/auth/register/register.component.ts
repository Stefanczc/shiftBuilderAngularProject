import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/authentication.service';
import { AuthErrorCodes } from 'firebase/auth';
import { Router } from '@angular/router';
import { ShareDataService } from 'src/app/shared/services/user.service';
import { birthdateValidator, emailValidator, passwordMatchValidator, passwordValidator } from '../../shared/validators/validators';
import { ROUTE_LOGIN } from 'src/app/app-routing.module';
import { ModalService } from 'src/app/shared/services/modal.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  showPassword1 = false;
  showPassword2 = false;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sharedDataService: ShareDataService,
    private modalService: ModalService,
    private loadingService: LoadingService
  ) {
    this.registerForm = this.fb.group({
      email: ['new@email.ro', [Validators.required, emailValidator()]],
      password: ['abc123$', [Validators.required, Validators.minLength(6), passwordValidator()]],
      passwordConfirm: ['abc123$', Validators.required],
      firstname: ['test', [Validators.required, Validators.minLength(2)]],
      lastname: ['new', [Validators.required, Validators.minLength(2)]],
      birthdate: ['1990-05-05', [Validators.required, birthdateValidator()]],
    }, {
      validators: passwordMatchValidator('password', 'passwordConfirm')
    });
  }

  ngOnInit() {}

  onSubmit() {
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    const birthdate = this.registerForm.get('birthdate')?.value;
    const firstname = this.registerForm.get('firstname')?.value;
    const lastname = this.registerForm.get('lastname')?.value;

    this.authService.registerUser(this.registerForm)
      .then(() => {
        this.authService.setLoginFormData({ email, password });
        this.sharedDataService.setUserData({
          email,
          password,
          birthdate,
          firstname,
          lastname,
        });
        this.loadingService.showForDuration(2000);
        this.modalService.openModal('Success', 'Congratulations, feel free to login and enjoy E-shift!', 'success');
        this.router.navigate([`/${ROUTE_LOGIN}`]);
        this.registerForm.reset();
      })
      .catch(error => {
        if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
          this.loadingService.showForDuration(2000);
          this.modalService.openModal('Error', 'E-mail is already in use', 'danger');
        } else {
          this.modalService.openModal('Error', 'Make sure there are no errors on the registration form', 'danger');
        }
      });
  }

  togglePasswordVisibility(field: number): void {
    if (field === 1) {
      this.showPassword1 = !this.showPassword1;
    } else if (field === 2) {
      this.showPassword2 = !this.showPassword2;
    }
  }
  
}
