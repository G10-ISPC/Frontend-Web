import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LogService } from '../../core/services/log.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { __values } from 'tslib';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  public readonly isAdmin$: Observable<boolean>=this.logService.isAdmin;
  public username: string | null = null; 
  public firstName: string | null = null; 
  public lastName: string | null = null;
constructor (private logService: LogService, 
  private router: Router
){
  this.isAdmin$.subscribe( __values=> { 
    console.log (__values) 
  }
  )
}
readonly isUserLogin$=this.logService.isUserLogin();

ngOnInit(): void { 
    this.logService.currentUser$.subscribe(user => {
    this.firstName = user.first_name;
    this.lastName = user.last_name;
  });

  console.log('First Name:', this.firstName);  
  console.log('Last Name:', this.lastName); 

  window.addEventListener('click', () => this.logService.startSessionTimeout());
  window.addEventListener('mousemove', () => this.logService.startSessionTimeout());
  window.addEventListener('keydown', () => this.logService.startSessionTimeout());

}

logout():void{
  this.logService.logout();
}
}
