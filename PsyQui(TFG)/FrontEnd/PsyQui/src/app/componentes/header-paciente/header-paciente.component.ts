import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header-paciente',
  templateUrl: './header-paciente.component.html',
  styleUrl: './header-paciente.component.css'
})
export class HeaderPacienteComponent {

  constructor(private router:Router, private cookies:CookieService){
    
  }

  cerrarSession(){
    this.cookies.delete("Session");
    this.router.navigate(["/"])
  }
  
}
