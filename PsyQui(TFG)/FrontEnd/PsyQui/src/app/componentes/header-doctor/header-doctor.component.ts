import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header-doctor',
  templateUrl: './header-doctor.component.html',
  styleUrl: './header-doctor.component.css'
})
export class HeaderDoctorComponent {

  constructor(private router:Router, private cookies:CookieService){
    
  }

  cerrarSession(){
    this.cookies.delete("Session");
    this.router.navigate(["/inicioDoc"])
  }

}


