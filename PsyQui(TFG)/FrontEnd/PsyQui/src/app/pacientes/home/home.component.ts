import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { first, firstValueFrom } from 'rxjs';
import { Doctor, Relation, User } from 'src/app/interfaces/user';
import { BbddService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean = true;
  guidSession: string = "notFound";
  user: User = {
    email: "",
    password: ""
  };
  sexo: string = "";
  patient: any = {};
  doctorsPending: Doctor[] = [];
  estado: string = "";
  pending: any = {};
  citas: any = {};
  relation: boolean = false;

  constructor(private _usersService: BbddService, private cookies: CookieService, private toastr: ToastrService, private router: Router) {}

  async ngOnInit() {
    this.guidSession = this.cookies.get("Session");
    await this.checkSession();
    console.log(this.relation);
  }

  async cancelarPending() {
    let eliminar = confirm("¿Estás seguro de querer cancelar la solicitud? Tendrás que volver a solicitarla si quieres que el mismo doctor te atienda.");
    if(eliminar){
        try {
            const pendingList = await firstValueFrom(this._usersService.getPendingPatient(this.patient.idPatient));
            if (pendingList.length > 0) {
                this.pending = pendingList[0];
                await firstValueFrom(this._usersService.delPending(this.pending.id));
                window.location.reload();
            } else {
                console.warn("No se encontró ninguna solicitud pendiente.");
            }
        } catch (error) {
            console.error("Error al cancelar la solicitud pendiente:", error);
        }
    }
}

  async checkListPendings() {
    try {
      if(this.patient && this.patient.idPatient){
        const responseRela = await firstValueFrom(this._usersService.getRelationByPatient(this.patient.idPatient));
        console.log(responseRela);
        if(responseRela !== null){
          this.relation = true;
          this.citas = await firstValueFrom(this._usersService.getCitasForPatient(this.patient.idPatient));
          console.log(this.citas)
        }
        const data = await firstValueFrom(this._usersService.getPendingPatient(this.patient.idPatient));
        if (data) {
          data.forEach(async p => {
            const doctor = await firstValueFrom(this._usersService.getDoctorById(p.idDoc));
            this.doctorsPending.push(doctor);
            this.estado = p.estado;
            if(this.estado === "Rechazado" || this.estado === "Aceptado"){
              if(p.id !== undefined){
                await firstValueFrom(this._usersService.delPending(p.id));
              }
            }
          });
        }
      }
    } catch (error) {
      console.error("Error al obtener los pendientes del paciente:", error);
    }
  }

  async checkSession() {
    try {
      const data = await firstValueFrom(this._usersService.checkSession(this.guidSession));
      if (data) {
        this.user = data;
        this.isAuthenticated = true;
        if (this.guidSession === "notFound" || this.user.email === "" || this.user.tipo === "Doctor") {
          this.isAuthenticated = false;
        } else {
          await this.loadPatientData();
          await this.checkListPendings();
        }
      } else {
        this.isAuthenticated = false;
      }
    } catch (error) {
      console.error("Error al verificar la sesión:", error);
      this.isAuthenticated = false;
    }
  }

  async loadPatientData() {
    try {
      this.patient = await firstValueFrom(this._usersService.getPatient(this.user.email));
      this.sexo = this.patient.genero;
      
    } catch (error) {
      console.error("Error al obtener los datos del paciente:", error);
    }
  }

  formatSpanishDate(dateString: string): string {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const dateParts = dateString.split('-');
    const year = dateParts[0];
    const monthIndex = parseInt(dateParts[1], 10) - 1;
    const day = dateParts[2];
    const monthName = months[monthIndex];
    return `${day} de ${monthName} de ${year}`;
  }
  
}
