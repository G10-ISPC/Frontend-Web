import { Component } from '@angular/core';
import { NosotrosService } from '../../core/services/nosotros.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})

export class NosotrosComponent {
  developerList: any;

  constructor(private NosotrosService:NosotrosService)
  {
    this.developerList = NosotrosService.obtenerDeveloper();
  }
  
  trackById(index: number, item: any): number {
    return item.id;
  }

}




  





