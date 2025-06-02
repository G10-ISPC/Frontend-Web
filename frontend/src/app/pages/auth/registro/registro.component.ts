
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { usuario } from '../../../core/interfaces/usuario';
import { RegistroService } from '../../../core/services/registro.service';

const letrasPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
const phonePattern = /^\d{10,15}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])[A-Za-z0-9!@#$%^&*()\-_=+{};:,<.>]{8,}$/; 


export function passwordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword);

    if (passwordControl && confirmPasswordControl && passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPasswordControl?.setErrors(null);
      return null;
    }
  };
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent {
  formRegister: FormGroup;
  showSuccessMessage: boolean = false;
  successMessage: string = "";

  constructor(private formBuilder: FormBuilder, private router: Router, private registroService: RegistroService) {
    this.formRegister = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(passwordPattern)
      ]),
      password2: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      first_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(letrasPattern)]),
      last_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(letrasPattern)]),
      telefono: new FormControl('', [Validators.required, Validators.pattern(phonePattern)]),      
    }, { validators: passwordMatchValidator('password', 'password2') });
  }

  get password() { return this.formRegister.get('password') as FormControl; }
  get password2() { return this.formRegister.get('password2') as FormControl; }
  get email() { return this.formRegister.get('email') as FormControl; }
  get first_name() { return this.formRegister.get('first_name') as FormControl; }
  get last_name() { return this.formRegister.get('last_name') as FormControl; }
  get telefono() { return this.formRegister.get('telefono') as FormControl; }


  registrarUsuario() {
    if (this.formRegister.invalid) {
      this.formRegister.markAllAsTouched();
      return;
    }

    const objeto: usuario = {
      password: this.formRegister.value.password,
      password2: this.formRegister.value.password2,
      email: this.formRegister.value.email,
      first_name: this.formRegister.value.first_name,
      last_name: this.formRegister.value.last_name,
      telefono: this.formRegister.value.telefono,
      username: ''
    };

    this.registroService.registrarUsuario(objeto).subscribe({
      next: (data: any) => {
        if (data.token) {
          this.successMessage = "Usuario creado correctamente";
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          alert("No se pudo registrar");
        }
      },
      error: (error: any) => {
        console.error('Error al registrar usuario:', error.message);
      }
    });
  }
}
