
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LogService } from '../../core/services/log.service';
import { usuario } from '../../core/interfaces/usuario';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private LogService: LogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: [''],
      last_name: [''],
      password: [''],
      password2: [''],
      telefono: ['']
    });

    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.LogService.getUserProfile().subscribe(usuario => {
      console.log('Usuario recibido:', usuario);
      this.profileForm.patchValue({
        email: usuario.email,
        first_name: usuario.first_name,
        last_name: usuario.last_name,
        telefono: usuario.telefono ?? ''
      });
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const password = this.profileForm.value.password;
    const password2 = this.profileForm.value.password2;

    if (password || password2) {
      if (password !== password2) {
        alert('Las contraseñas no coinciden.');
        return;
      }
    }

    const payload: any = {
      email: this.profileForm.value.email,
      first_name: this.profileForm.value.first_name,
      last_name: this.profileForm.value.last_name,
      telefono: this.profileForm.value.telefono
    };

    if (password) {
      payload.password = password;
    }

    this.LogService.updateUserProfile(payload).subscribe(() => {
      alert('Perfil actualizado correctamente.');
    });
  }

  deleteAccount(): void {
    if (confirm('¿Estás seguro de que querés eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      this.LogService.deleteUserAccount().subscribe(() => {
        this.LogService.logout();
        alert('Tu cuenta ha sido eliminada.');
        this.router.navigate(['/login']);
      });
    }
  }
 
}
