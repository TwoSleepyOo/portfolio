import { PathLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Appointment, Doctor, NotAvailable, Patient, Relation, User } from 'src/app/interfaces/user';
import { BbddService } from 'src/app/services/users.service';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css'
})
export class CitasComponent implements OnInit{
  
  horas: string[] = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00'
  ];
  isAuthenticated: boolean = true;
  user: User = {
    email: "",
    password: ""
  };
  patient: Patient = {
    email: "",
    nombre: "",
    apellidos: "",
    genero: "",
    fecha_nac: "",
    telefono: "",
    provincia: "",
    domicilio: "",
    detalles: [],
    comentario: ""
  };
  guidSession: string = "notFound";
  relation: any = {};
  doctor: any = {};
  ND: NotAvailable[] = [];
  fechas: string[] = [];
  fechasOrdenadas: string[] = [];
  citas: Appointment[] = [];
  solicitarCita:FormGroup;
  coincidencia:boolean = false;
  constructor(
    private _usersService: BbddService, 
    private cookies: CookieService,
    private toastr: ToastrService,
    private fb:FormBuilder
  ) {
    this.solicitarCita = this.fb.group({
      fecha:[''],
      hora:['']
    });
  }

  ngOnInit() {
    this.guidSession = this.cookies.get("Session");
    this.checkSession();

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

  async borrarCita(id:number | undefined){
    await firstValueFrom(this._usersService.delAppointment(id));
    this.toastr.show("Cita cancelada con éxito","Cita cancelada");
    this.getCitas();
  }

  async createAppointment(){
    let fecha = this.solicitarCita.get("fecha")?.value
    let fechaCon = this.convertDateFormat(fecha);
    let hora = this.solicitarCita.get("hora")?.value;
    if(this.fechasOrdenadas.includes(fechaCon)){
      this.toastr.error("Mira las fechas no disponibles e inténtalo de nuevo","Esa fecha no está disponible");
      return;
    }
    this.citas.forEach(c => {console.log(c);if(c.fecha === fecha && c.hora === hora && c.estado === "Aceptada"){this.coincidencia === true;}});
    if(this.coincidencia){
      this.coincidencia = false;
      this.toastr.error("Prueba con otro día u otra hora","La fecha y la hora ya están cogidas");
      return;
    }
    if(this.patient.idPatient !== undefined){
      const citaCR: Appointment = {
        idDoc:this.doctor.idDoc,
        idPatient:this.patient.idPatient,
        fecha: fecha,
        hora: hora,
        estado: "Pendiente"
      };
      await this._usersService.addAppointment(citaCR);
      await this.getCitas();
    }
  }

  async checkSession() {
    this._usersService.checkSession(this.guidSession).subscribe(
      async data => {
        if (data) {
          this.user = data;
          this.isAuthenticated = true;
          if (this.guidSession === "notFound" || this.user.email === "" || this.user.tipo === "Doctor") {
            this.isAuthenticated = false;
          } else {
            await this.loadPatientData();
          }
        } else {
          this.isAuthenticated = false;
        }
      },
      error => {
        console.error(error);
        this.isAuthenticated = false;
      }
    );
  }

  async getCitas(){
    this.citas = await firstValueFrom(this._usersService.getCitasForPatient(this.patient.idPatient));
  }

  async loadDoctorRelaNDApp(){
    this.relation = await firstValueFrom(this._usersService.getRelationByPatient(this.patient.idPatient));
    this.doctor = await firstValueFrom(this._usersService.getDoctorById(this.relation.idDoc));
    this.ND = await firstValueFrom(this._usersService.getNotAvailableByDoc(this.doctor.idDoc));
    this.ND.forEach(nd => this.fechas.push(nd.fecha));
    this.fechas.forEach(f => this.fechasOrdenadas.push(this.convertDateFormat(f)));
    this.fechasOrdenadas = this.sortConvertedDates(this.fechasOrdenadas);
    this.getCitas();
  }

  async loadPatientData() {
    try {
      this.patient = await firstValueFrom(this._usersService.getPatient(this.user.email));
      this.loadDoctorRelaNDApp();
    } catch (error) {
      console.error("Error al obtener los datos del paciente:", error);
    }
  }

  convertDateFormat(dateString: string): string {
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) {
      throw new Error('Formato de fecha inválido');
    }
    const [year, month, day] = dateParts;
    return `${day}/${month}/${year}`;
  }
  
  sortConvertedDates(dates: string[]): string[] {
    return dates.sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/').map(part => parseInt(part, 10));
      const [dayB, monthB, yearB] = b.split('/').map(part => parseInt(part, 10));
      if (yearA !== yearB) {
        return yearA - yearB;
      } else if (monthA !== monthB) {
        return monthA - monthB;
      } else {
        return dayA - dayB;
      }
    });
  }

}
