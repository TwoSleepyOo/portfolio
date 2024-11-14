import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { BbddService } from 'src/app/services/users.service';

@Component({
  selector: 'app-registro-fast',
  templateUrl: './registro-fast.component.html',
  styleUrl: './registro-fast.component.css'
})
export class RegistroFastComponent {
  signUp:FormGroup;
  usersList:any [] = [];
  userReg: User = {
    email:"",
    password:""
  }

  constructor(private _usersService:BbddService, private toastr:ToastrService, private fb:FormBuilder, private router:Router){
    this.signUp = this.fb.group({
      email: [''],
      password: [''],
      passwordRep: [''],
      TyC:[false, Validators.requiredTrue]
    })
  }

  ngOnInit(){
      this.getUsers();
  }

  getUsers(){
    this._usersService.getListUsers().subscribe(data=>{
      this.usersList = data;
    })
  }

  async registrarse(){
    const user:any = {
      email: this.signUp.get('email')?.value,
      password: this.signUp.get('password')?.value,
      passwordRep: this.signUp.get('passwordRep')?.value,
      TyC: this.signUp.get('TyC')?.value
    }
    if(user.password != user.passwordRep){
      this.toastr.error('Vuelve a escribirla','Las contraseñas no coinciden');
      return;
    }
    for( var i = 0; i<this.usersList.length; i++ ){
      if(this.usersList[i].email.toLowerCase() == user.email.toLowerCase()){
        this.toastr.error('Prueba a iniciar sesión o poner otro email','Ya hay un usuario registrado con ese correo');
        return;
      }
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!regex.test(user.password)){
      this.toastr.error('El formato de la contraseña no es el adecuado','La contraseña debe tener al menos una minúscula, una mayúscula, un número, un caracter no alfanumérico y una longitud de 8 caracteres')
      return;
    }
    
    this.userReg = {
      email:user.email,
      password:user.password,
      tipo:"Paciente"
    }

    await this._usersService.addUser(this.userReg);
    this.router.navigate(['']);
    return;
  }
}
