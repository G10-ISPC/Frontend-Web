import { Injectable } from '@angular/core';
import { Developer } from '../interfaces/developer';


@Injectable({
  providedIn: 'root',
})

export class NosotrosService {
  developerList: Developer[] = [];

  constructor() { }  

obtenerDeveloper()
  {
    this.developerList = [
      {
        id: 1,
        name: 'Mariana Cos',
        fotoUrl: '../assets/img/mariana.png',
        rol: 'Developer Team',
        redesSociales: {          
          linkedin: 'https://www.linkedin.com',
          github: 'https://github.com',
          },
        
      },

      {
        id: 2,
        name: 'Carla Arévalo',
        fotoUrl: '../assets/img/carla.png',
        rol: 'Developer Team',
        redesSociales: {          
          linkedin: 'https://www.linkedin.com',
          github: 'https://github.com/CarlaArevalo',
        },
        
      },
      
      {
        id: 3,
        name: 'Micaela Juarez',
        fotoUrl: '../assets/img/micaela.png',
        rol: 'Developer Team',
        redesSociales: {          
          linkedin: 'https://www.linkedin.com',
          github: 'https://github.com',
        },
        
      },

      {
        id: 4,
        name: 'Delfina Aricoma',
        fotoUrl: '../assets/img/delfina.png',
        rol: 'Developer Team',
        redesSociales: {          
          linkedin: 'https://www.linkedin.com',
          github: 'https://github.com',
        },
        
      },

      {
        id: 5,
        name: 'Melisa Gulle',
        fotoUrl: '../assets/img/Melisa.png',
        rol: 'Developer Team',
        redesSociales: {          
          linkedin: 'https://www.linkedin.com',
          github: 'https://github.com',
        },
        
      },

      {
        id: 6,
        name: 'Dalma Ponce',
        fotoUrl: '../assets/img/Dalma.jpg',
        rol: 'Developer Team',
        redesSociales: {          
          linkedin: 'https://www.linkedin.com',
          github: 'https://github.com',
        },
        
      },

      {
        id: 7,
        name: 'Laura Cruz',
        fotoUrl: '../assets/img/laura.png',
        rol: 'Developer Team',
        redesSociales: {          
          linkedin: 'https://www.linkedin.com',
          github: 'https://github.com',
        },
        
      },

      {
        id: 8,
        name: 'Ernesto Cevasco',
        fotoUrl: '../assets/img/Ernesto.png',
        rol: 'Developer Team',
        redesSociales: {          
          linkedin: 'https://www.linkedin.com',
          github: 'https://github.com/Noobuyer',
        },
        
      },

    ];
    return this.developerList;
  }
}

