import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    return (control: AbstractControl): ValidationErrors | null => {
        const value: string = control.value;

        if (!value) {
            return null;
        }

        return emailRegex.test(value) ? null : { invalidEmail: true };
    };
}

export function passwordValidator(): ValidatorFn {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;
  
      if (!value) {
        return null;
      }
  
      return passwordRegex.test(value) ? null : { invalidPassword: true };
    };
  }

export function passwordMatchValidator(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
    return (controls: AbstractControl): ValidationErrors | null => {
        const passwordControl = controls.get(passwordControlName);
        const confirmPasswordControl = controls.get(confirmPasswordControlName);

        if (!passwordControl || !confirmPasswordControl) {
            return null;
        }

        const password = passwordControl.value;
        const confirmPassword = confirmPasswordControl.value;

        if (password !== confirmPassword) {
            confirmPasswordControl.setErrors({ passwordMatch: true });
            return { passwordMatch: true };
        } else {
            return null;
        }
    };
}

export function birthdateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value: string = control.value;

        if (!value) {
            return null;
        }

        const birthdate = new Date(value);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthdate.getFullYear();

        if (
            age < 6 ||
            (age === 6 &&
              (currentDate.getMonth() < birthdate.getMonth() ||
                (currentDate.getMonth() === birthdate.getMonth() &&
                  currentDate.getDate() < birthdate.getDate())))
          ) {
            return { invalidAgeRange: true };
        }

        return null;
    };
}
