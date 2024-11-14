import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BbddService } from 'src/app/services/users.service';
import { firstValueFrom } from 'rxjs';
import { Doctor, Patient, User, Relation, Pending } from 'src/app/interfaces/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-doc',
  templateUrl: './home-doc.component.html',
  styleUrls: ['./home-doc.component.css']
})
export class HomeDocComponent implements OnInit {
  isAuthenticated: boolean = true;
  listPatients: Relation[] = [];
  guidSession: string = "notFound";
  user: User = {
    email: "",
    password: ""
  };
  sexo: string = "";
  doctor: any = {};
  patientsPending: Patient[] = [];
  pendings: Pending[] = [];

  constructor(
    private _usersService: BbddService,
    private cookies: CookieService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.guidSession = this.cookies.get("Session");
    this.checkSession();
  }

  async modPending(idPatient: number | undefined, estado: string) {
    try {
      const data = await firstValueFrom(this._usersService.getPendingPatient(idPatient));
      for (const p of data) {
        const response = await firstValueFrom(this._usersService.updatePendingStatus(p.id, estado));
        this.patientsPending = this.patientsPending.filter(pat => pat.idPatient !== idPatient);
        console.log(response);
        if (estado === 'Aceptado') {
          if(idPatient != undefined){
            let relation: Relation = {
              idDoc: this.doctor.idDoc,
              idPatient: idPatient,
              notas:"No hay notas."
            }
            await this._usersService.addRelation(relation);
          }
          this.toastr.success('Se notificará al paciente','Solicitud aceptada');
        } else if (estado === 'Rechazado') {
          this.toastr.error('Se notificará al paciente','Solicitud rechazada');
        }
      }
    } catch (error) {
      console.error("Error al obtener la solicitud de tratamiento:", error);
    }
  }

  async checkListPendings() {
    try {
      const data = await firstValueFrom(this._usersService.getPendingDoc(this.doctor.idDoc));
      if (data) {
        this.pendings = data;
        for (const p of data) {
          if (p.estado === "Pendiente") {
            const patient = await firstValueFrom(this._usersService.getPatientById(p.idPatient));
            this.patientsPending.push(patient);
          }
        }
      }
    } catch (error) {
      console.error("Error al obtener los pendientes del doctor:", error);
    }
  }

  async checkSession() {
    try {
      const data = await firstValueFrom(this._usersService.checkSession(this.guidSession));
      if (data) {
        this.user = data;
        this.isAuthenticated = true;
        if (this.guidSession === "notFound" || this.user.email === "" || this.user.tipo === "Paciente") {
          this.isAuthenticated = false;
        } else {
          await this.loadDoctorData();
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

  async loadDoctorData() {
    try {
      this.doctor = await firstValueFrom(this._usersService.getDoctor(this.user.email));
      this.sexo = this.doctor.genero;
      console.log(this.user, this.doctor);
    } catch (error) {
      console.error("Error al obtener los datos del doctor:", error);
    }
  }
}
