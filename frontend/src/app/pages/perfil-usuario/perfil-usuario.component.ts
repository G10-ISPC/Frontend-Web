
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
  //varibles para habilitar edicion
  isEditing: boolean = false;
  originalDataBackup: Partial<usuario> = {};

  constructor(
    private fb: FormBuilder,
    private LogService: LogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserProfile();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      email: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      telefono: ['']
    });
    this.profileForm.disable();
  }

  loadUserProfile(): void {
    this.LogService.getUserProfile().subscribe({ 
      next: (usuario: usuario) =>{
        //console.log('Usuario recibido:', usuario);
        this.profileForm.patchValue({
          email: usuario.email,
          first_name: usuario.first_name,
          last_name: usuario.last_name,
          telefono: usuario.telefono ?? ''
        });
      },
      error: (err) => console.error('Error cargando perfil:', err)
    });
  }

  startEditing(): void { 
    this.isEditing = true;
    this.originalDataBackup = this.profileForm.getRawValue(); 
    this.profileForm.enable(); 
  }
  
  cancelEditing(): void {
    this.isEditing = false;
    this.profileForm.patchValue(this.originalDataBackup);
    this.profileForm.disable();
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const payload: any = {
      email: this.profileForm.value.email,
      first_name: this.profileForm.value.first_name,
      last_name: this.profileForm.value.last_name,
      telefono: this.profileForm.value.telefono
    };


    this.LogService.updateUserProfile(payload).subscribe({ next: () => {
      alert('Perfil actualizado correctamente.');
      this.isEditing = false;
      this.profileForm.disable();
    },
    error: (err) => {
      alert('Error al actualizar el perfil');
      console.error(err);
    }
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
