import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

const namePattern = /^[a-zA-Z]*$/;
const phonePattern = /^[0-9]*$/;

@Component({
  selector: 'app-contacto',
  standalone: true,

  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {

  get name(){
    return this.formUser.get('name') as FormControl;
  }
  get surname(){
    return this.formUser.get('surname') as FormControl;
  }
  get email(){
    return this.formUser.get('email') as FormControl;
  }
  get phone(){
    return this.formUser.get('phone') as FormControl;
  }
  get message(){
    return this.formUser.get('message') as FormControl;
  }


  formUser= new FormGroup({
    'name' : new FormControl('', [Validators.required, Validators.pattern(namePattern)]),
    'surname' : new FormControl('', [Validators.required, Validators.pattern(namePattern)]),
    'email': new FormControl('',[Validators.required, Validators.email]),
    'phone': new FormControl('', [Validators.required, Validators.pattern(phonePattern)]),
    'message': new FormControl('',Validators.required),
  } );
  


}



