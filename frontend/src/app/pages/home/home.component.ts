import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  
  popularBurgers = [
    {
      name: 'Burgers Jobs',
      image: 'assets/img/bur2.jpg',
      description: 'La opción perfecta para acompañar tu día, con pollo fresco y verduras.'
    },
    {
      name: 'Bill Gates',
      image: 'assets/img/bur1.jpg',
      description: '¡La hamburguesa más deseada por todos!'
    },
    {
      name: '♡ Doble Love ♡',
      image: 'assets/img/bur5.jpg',
      description: 'Ideal para compartir con esa persona especial, ¡el doble de sabor y amor!'
    }
  ];
}
