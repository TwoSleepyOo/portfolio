import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Patient, Relation, User } from 'src/app/interfaces/user';
import { BbddService } from 'src/app/services/users.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {
  isAuthenticated: boolean = true;
  guidSession: string = "notFound";
  user: User = {
    email: "",
    password: ""
  };
  doctor: any = {};
  patients: Patient[] = [];
  relations: Relation[] = [];
  isReadOnly: boolean[] = [];
  originalNotas: { [idPatient: number]: string } = {};

  constructor(
    private _usersService: BbddService, 
    private cookies: CookieService,
    private toastr: ToastrService, 
    private router: Router
  ) {}

  async ngOnInit() {
    this.guidSession = this.cookies.get("Session");
    await this.checkSession();
    if (this.isAuthenticated) {
      await this.getPatientsFromDoc();
    }
  }

  async getPatientsFromDoc() {
    const relaPatients = await firstValueFrom(this._usersService.getRelationsByDoc(this.doctor.idDoc));
    for (const r of relaPatients) {
      const patient = await firstValueFrom(this._usersService.getPatientById(r.idPatient));
      this.patients.push(patient);
      this.relations.push(r);
      this.isReadOnly.push(true);
      this.originalNotas[r.idPatient] = r.notas ?? ''; // Asegúrate de que notas no sea undefined
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
      console.log(this.user, this.doctor);
    } catch (error) {
      console.error("Error al obtener los datos del doctor:", error);
    }
  }

  toggleEdit(index: number) {
    if (this.isReadOnly[index]) {
      this.isReadOnly[index] = false;
    } else {
      this.isReadOnly[index] = true;
      const notas = this.relations[index].notas ?? '';
      this._usersService.updateNotasFromRelation(this.relations[index].idPatient, notas)
        .subscribe({
          next: (updatedRelation) => {
            this.relations[index] = updatedRelation;
            this.toastr.success('Notas guardadas con éxito');
          },
          error: (error) => {
            console.error("Error al actualizar las notas:", error);
            this.toastr.error('Error al guardar las notas');
          }
        });
    }
  }

  cancelEdit(index: number) {
    this.isReadOnly[index] = true;
    this.relations[index].notas = this.originalNotas[this.relations[index].idPatient];
  }
}
