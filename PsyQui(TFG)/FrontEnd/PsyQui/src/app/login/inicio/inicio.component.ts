import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { BbddService } from 'src/app/services/users.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  login:FormGroup;
  usersList:User [] = [];
  retorno:boolean = false;
  generatedGUID:string = "";

  constructor(private _usersService:BbddService, private toastr:ToastrService , private fb:FormBuilder, private router:Router, private cookies:CookieService){
    this.login = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  ngOnInit() {
      this.getUsers();
  }

  getUsers(){
    this._usersService.getListUsers().subscribe(data=>{
      this.usersList = data;
    })
  }

  async comprobarIni(){
    if(this.retorno) {
      this.cookies.set("Session",this.generatedGUID,3600*1000)
      this.router.navigate(["/Home"]);
      return;
    } 
    else {
      this.toastr.error('Vuelve a escribirla.', 'Contraseña incorrecta!');
      return;
    }
  }

  async iniciarSesion() {
    const user: User = {
      email: this.login.get('email')?.value,
      password: this.login.get('password')?.value
    };
    let foundUser = false;
    for (let i = 0; i < this.usersList.length; i++) {
      if (this.usersList[i].email.toLowerCase() === user.email.toLowerCase() && this.usersList[i].tipo !== "Doctor") {
        foundUser = true;
        await new Promise<void>((resolve, reject) => {
          this._usersService.getUser(this.usersList[i].id!, user.password).subscribe(data => {
            if (data.guid != null) {
              this.generatedGUID = data.guid;
              this.retorno = true;
            } else {
              this.retorno = false;
            }
            resolve();
          }, error => {
            reject(error);
          });
        });
        await this.comprobarIni();
      }
    }
    if (!foundUser) {
      this.toastr.error('El email no existe o es un email de doctor', 'Email incorrecto!');
    }
  }
}
