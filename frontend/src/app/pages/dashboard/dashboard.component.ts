import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { HistorialdecomprasComponent } from './historialdecompras/historialdecompras.component';
import { LogService } from '../../core/services/log.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    // PerfilUsuarioComponent,
    HistorialdecomprasComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showPerfil = false;
  showHistorial = false;
  public firstName: string | null = null;
  public lastName: string | null = null;

  constructor(private logService: LogService) {}

  showPerfilComponent() {
    this.resetViews();
    this.showPerfil = true;
  }

  showHistorialComponent() {
    this.resetViews();
    this.showHistorial = true;
  }
  
  private resetViews() {
    this.showPerfil = false;
    this.showHistorial = false;
  }

  ngOnInit(): void {
    const userInfo = this.logService.getUserIdFromToken(); 
    console.log('User Info:', userInfo); 
    
    this.firstName = userInfo.first_name;    
    this.lastName = userInfo.last_name;

    console.log('First Name:', this.firstName);  
    console.log('Last Name:', this.lastName);  
  }

  readonly isUserLogin$ = this.logService.isUserLogin();
}
