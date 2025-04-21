// login.component.ts

import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LogService } from '../../core/services/log.service';
import { LogRequest } from '../../shared/interfaces/logRequest';
import { LogResponse } from '../../shared/interfaces/logResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError: string = "";
  loginForm!: FormGroup;
  showWelcomeMessage: boolean = false;
  welcomeMessage: string = "";
  passwordFieldType: string = 'password';

  // Nueva variable para gestionar los intentos de login
  loginAttempts: number = 0;
  MAX_ATTEMPTS: number = 3; // Máximo de intentos fallidos
  BLOCK_TIME: number = 5 * 60 * 1000; // 5 minutos de bloqueo
  blockStartTime: number = 0;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private logService: LogService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8), // Mínimo 8 caracteres
        Validators.pattern('.*[A-Z].*'), // Al menos una mayúscula
        Validators.pattern('.*[0-9].*'), // Al menos un número
        Validators.pattern('.*[!@#$%^&*(),.?":{}|<>].*') // Al menos un carácter especial (opcional)
      ]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  // Función para verificar si el login está bloqueado
  isBlocked(): boolean {
    if (this.blockStartTime === 0) {
      return false; // No está bloqueado
    }
    const currentTime = Date.now();
    if (currentTime - this.blockStartTime >= this.BLOCK_TIME) {
      this.resetLoginAttempts(); // Reiniciar intentos después del tiempo de bloqueo
      return false; // Ya no está bloqueado
    }
    return true; // Aún está bloqueado
  }

  // Resetear intentos de login
  resetLoginAttempts(): void {
    this.loginAttempts = 0;
    this.blockStartTime = 0;
  }

  login() {
    if (this.isBlocked()) {
      alert("Cuenta bloqueada. Intenta de nuevo después de 5 minutos.");
      return;
    }

    if (this.loginForm.valid) {
      const credentials: LogRequest = this.loginForm.value;
      this.logService.login(credentials).subscribe({
        next: (userData: LogResponse) => {
          const userInfo = this.logService.getUserIdFromToken();
          const firstName = userInfo.first_name;
          const lastName = userInfo.last_name;
          this.welcomeMessage = `Login exitoso.. Bienvenido ${firstName} ${lastName}`;
          this.showWelcomeMessage = true;
          setTimeout(() => {
            this.showWelcomeMessage = false;
            this.router.navigateByUrl('/home');
          }, 3000);
          this.loginForm.reset();
          this.resetLoginAttempts(); // Reiniciar intentos al hacer login exitoso
        },
        error: (error) => {
          console.error("Error en el inicio de sesión:", error);
          this.loginError = error.message || "Error en el inicio de sesión.";
          alert(this.loginError);

          this.loginAttempts++;
          if (this.loginAttempts >= this.MAX_ATTEMPTS) {
            this.blockStartTime = Date.now(); // Bloquear después de 3 intentos fallidos
            alert("Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos.");
          }

          this.loginForm.reset();
        },
        complete: () => {
          console.info("Login completo");
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      alert("Por favor, complete todos los campos correctamente.");
    }
  }
}
