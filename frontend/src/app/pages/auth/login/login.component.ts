import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LogService } from '../../../core/services/log.service';
import { LoginRequest } from '../../../core/interfaces/request-response';
import { LoginResponse } from '../../../core/interfaces/request-response';
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

  loginAttempts: number = 0;
  MAX_ATTEMPTS: number = 3; 
  BLOCK_TIME: number = 5 * 60 * 1000; 
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
        Validators.minLength(8), 
        Validators.pattern('.*[A-Z].*'), 
        Validators.pattern('.*[0-9].*'), 
        Validators.pattern('.*[!@#$%^&*(),.?":{}|<>].*') 
      ]],
    });
    setTimeout(() => {
      this.loginForm.reset();
    }, 0);    
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

  
  isBlocked(): boolean {
    if (this.blockStartTime === 0) {
      return false; 
    }
    const currentTime = Date.now();
    if (currentTime - this.blockStartTime >= this.BLOCK_TIME) {
      this.resetLoginAttempts(); 
      return false; 
    }
    return true; 
  }

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
      const credentials: LoginRequest = this.loginForm.value;
      this.logService.login(credentials).subscribe({
        next: (userData: LoginResponse) => {
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
          this.resetLoginAttempts(); 
        },
        error: (error) => {
          console.error("Error en el inicio de sesión:", error);
          this.loginError = error.message || "Error en el inicio de sesión.";
          alert(this.loginError);

          this.loginAttempts++;
          if (this.loginAttempts >= this.MAX_ATTEMPTS) {
            this.blockStartTime = Date.now(); 
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
