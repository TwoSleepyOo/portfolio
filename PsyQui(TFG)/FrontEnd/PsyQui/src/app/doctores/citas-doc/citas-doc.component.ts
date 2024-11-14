import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Appointment, NotAvailable, Patient, Relation, User } from 'src/app/interfaces/user';
import { BbddService } from 'src/app/services/users.service';

@Component({
  selector: 'app-citas-doc',
  templateUrl: './citas-doc.component.html',
  styleUrl: './citas-doc.component.css'
})
export class CitasDocComponent {
    isAuthenticated: boolean = true;
    guidSession: string = "notFound";
    user: User = {
      email: "",
      password: ""
    };
    doctor: any = {};
    citas: Appointment[] = []
    citasDia: Appointment[] = [];
    formND: FormGroup;
    notAvailableDocs:NotAvailable[] = [];
    includesNA: boolean = false;
    fechas:string [] = [];
    fechasOrdenadas: string[] = [];
    citasPen: Appointment[] = [];
    citasCon: Appointment[] = [];
  
    constructor(
      private _usersService: BbddService, 
      private cookies: CookieService,
      private toastr: ToastrService,
      private fb:FormBuilder
    ) {
      this.formND = this.fb.group({
        fecha:['']
      });
    }

    async ngOnInit() {
      this.guidSession = this.cookies.get("Session");
      await this.checkSession();
      this.getAllND();
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

    async rechazarCita(id:number | undefined){
      await firstValueFrom(this._usersService.updateAppointment(id,"Rechazada"));
      this.toastr.show("Cita rechazada con éxito","Cita rechazada");
      this.getCitas();
    }

    async aceptarCita(id:number | undefined){
      await firstValueFrom(this._usersService.updateAppointment(id,"Aceptada"));
      this.toastr.success("Cita confirmada con éxito","Cita confirmada");
      this.getCitas();
    }
  
    async cancelarCita(id:number | undefined){
      await firstValueFrom(this._usersService.updateAppointment(id,"Cancelada"));
      this.toastr.show("Cita cancelada con éxito","Cita cancelada");
      this.getCitas();
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
    
    
    async getAllND(){
      this.notAvailableDocs = await firstValueFrom(this._usersService.getNotAvailableByDoc(this.doctor.idDoc));
      this.notAvailableDocs.forEach(na => this.fechas.push(na.fecha));
      this.fechas.forEach(f => this.fechasOrdenadas.push(this.convertDateFormat(f)));
      this.fechasOrdenadas = this.sortConvertedDates(this.fechasOrdenadas);
    }

    async createNoDisponible(){
      const notAvailable: NotAvailable = {
        idDoc: this.doctor.idDoc,
        fecha: this.formND.get('fecha')?.value
      }
      this.notAvailableDocs = await firstValueFrom(this._usersService.getNotAvailableByDoc(this.doctor.idDoc));
      this.notAvailableDocs.forEach(n => {
        if(n.fecha === notAvailable.fecha){
          this.includesNA = true;
        }
      });
      if(!this.includesNA){
        console.log(notAvailable.fecha);
        await firstValueFrom(this._usersService.delAppointmentByDate(notAvailable.fecha));
        this._usersService.addNotAvailable(notAvailable);
        this.toastr.success("Has marcado ese día como no disponible, ningún paciente podrá solicitar cita ese día", "Día no disponible establecido");
        this.fechasOrdenadas.push(this.convertDateFormat(notAvailable.fecha));
        this.fechasOrdenadas = this.sortConvertedDates(this.fechasOrdenadas);
      }
      else{
        this.toastr.error("Parece que te has olvidado que ya lo marcaste","Día no disponible ya marcado");
      }
    }

    async delNoDisponible(){
      
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
  
    async getCitas(){
      this.citas = [];
      this.citasCon = [];
      this.citasPen = [];
      this.citas = await firstValueFrom(this._usersService.GetCitasDoc(this.doctor.idDoc));
      this.citas.forEach(c=>{if(c.estado === "Pendiente"){this.citasPen.push(c)}else if(c.estado !== "Pendiente" && c.estado !== "Rechazada" && c.estado !== "Cancelada"){this.citasCon.push(c)}});
    }

    async loadDoctorData() {
      try {
        this.doctor = await firstValueFrom(this._usersService.getDoctor(this.user.email));
        await this.getCitas()
      } catch (error) {
        console.error("Error al obtener los datos del doctor:", error);
      }
    }

}
