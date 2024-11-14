import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Doctor, Patient, Pending, Relation, User } from 'src/app/interfaces/user';
import { BbddService } from 'src/app/services/users.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {
  especialidades = [
    { nombre: 'Esquizofrenia', valor: 'Esquizofrenia' },
    { nombre: 'TOC', valor: 'TOC' },
    { nombre: 'TEA', valor: 'TEA' },
    { nombre: 'TEPT', valor: 'TEPT' },
    { nombre: 'Trastorno bipolar', valor: 'Trastorno bipolar' },
    { nombre: 'TLP', valor: 'TLP' },
    { nombre: 'TID', valor: 'TID' },
    { nombre: 'TPA o Psicopatía', valor: 'TPA o Psicopatia' },
    { nombre: 'Ansiedad', valor: 'Ansiedad' },
    { nombre: 'Depresión', valor: 'Depresion' },
    { nombre: 'Problemas de adicción', valor: 'Problemas de adiccion' },
    { nombre: 'Control de la ira', valor: 'Control de la ira' },
    { nombre: 'Hipersexualidad', valor: 'Hipersexualidad' },
    { nombre: 'Bullying/Discriminación', valor: 'Bullying/Discriminacion' },
    { nombre: 'Trastorno alimenticio', valor: 'Trastorno alimenticio' },
    { nombre: 'Violencia de Género/Intrafamiliar', valor: 'Violencia de Genero/Intrafamiliar' }
  ];
  isAuthenticated: boolean = true;
  listPatients: Relation[] = [];
  guidSession: string = "notFound";
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
  problemas: string[] = [];
  problemasPaciente: string [] = [];
  doctores: Doctor[] = [];
  withFilters: boolean = true;
  btnFiltros: string = "Quitar filtros aplicados";
  btnAplicar: string = "Filtros";
  isDetailsVisible: boolean = false;
  cambioFiltros: boolean = false;
  womenOnly:boolean = false;
  menOnly:boolean = false;
  long:number = 0;

  constructor(
    private _usersService: BbddService,
    private cookies: CookieService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.guidSession = this.cookies.get("Session");
    this.checkSession();
    this.toastr.info("Para retirarlo o modificarlo despliega la barra de filtros", "Filtros por defecto aplicados");
  }

  soloMujeres(){
    if(this.menOnly){
      this.menOnly = false;
    }
    if(this.womenOnly){
      this.womenOnly = false;
      this.aplicarFiltros();
      return;
    }
    if(!this.womenOnly){
      this.womenOnly = true;
      this.aplicarFiltros();
      return;
    }
  }

  soloHombres(){
    if(this.womenOnly){
      this.womenOnly = false;
    }
    if(this.menOnly){
      this.menOnly = false;
      this.aplicarFiltros();
    }
    if(!this.menOnly){
      this.menOnly = true;
      this.aplicarFiltros();
    }
  }

  onCheckboxChange(especialidad: string) {
    const index = this.problemas.indexOf(especialidad);
    if (index === -1) {
        this.problemas.push(especialidad);
    } else {
        this.problemas.splice(index, 1);
    } 
    this.btnAplicar = "Aplicar filtros";
    this.cambioFiltros = true; 
  }

  async aplicarFiltros() {
    if (this.problemas !== this.problemasPaciente) {
      console.log(this.doctores);
      try {
        this.doctores = await firstValueFrom(this._usersService.getDoctorsBySpecialties(this.problemas));
        if(this.menOnly){
          this.doctores = this.doctores.filter(doctor => doctor.genero === 'masculino');
        }
        if(this.womenOnly){
          this.doctores = this.doctores.filter(doctor => doctor.genero === 'femenino');
        }
        console.log(this.doctores);
        this.cambioFiltros = false;
        this.btnAplicar = "Filtros";
      } catch (error) {
        console.error("Error al obtener doctores con filtros:", error);
      }
    } else {
        this.cambioFiltros = false;
        this.btnAplicar = "Filtros";
    }
  }  

  async comprobarPendings(): Promise<boolean> {
    if (this.patient.idPatient === undefined) {
      console.error("El idPatient no está definido");
      return false;
    }
    try {
      const rela = await firstValueFrom(this._usersService.getRelationByPatient(this.patient.idPatient));
      if(rela!=null){
        console.log(this.patient.idPatient)
        this.toastr.error("Asegúrate de no tener ningún doctor asignado para solicitar uno nuevo", "Ya estás a cargo de un doctor");
        return false;
      }
      else{
        const pendingPatients = await firstValueFrom(this._usersService.getPendingPatient(this.patient.idPatient));
        this.long = pendingPatients.length;
        if (this.long !== 0) {
         this.toastr.warning("Te recomendamos esperar a que el doctor la responda para solicitar otra", "Parece que ya tienes una solicitud de atención hecha");
         return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error al comprobar pendientes:", error);
      return false;
    }
  }
  
  async crearPending(idDoc: number) {
    if (this.patient.idPatient === undefined) {
      console.error("El idPatient no está definido");
      return;
    }
    const canCreatePending = await this.comprobarPendings();
    if (!canCreatePending) {
      return;
    }
    let pending: Pending = {
      idDoc: idDoc,
      idPatient: this.patient.idPatient,
      estado: "Pendiente"
    };
    try {
      await this._usersService.addPending(pending);
      this.router.navigate(["/Home"]);
    } catch (error) {
      console.error("Error al crear pendiente:", error);
    }
  }
  

  async changeFiltros() {
    if (this.withFilters) {
      this.doctores = await firstValueFrom(this._usersService.getListDocs());
      this.withFilters = false;
      this.btnFiltros = "Restablecer filtros por defecto"
    } else {
      this.getDocsWithFilters();
      this.withFilters = true;
      this.btnFiltros = "Borrar filtros";
      window.location.reload();
    }
  }

  async getDocsWithFilters() {
    try {
      this.doctores = await firstValueFrom(this._usersService.getDoctorsByPatientDetails(this.patient));
      this.btnAplicar = "Filtros";
      this.cambioFiltros = false;
    } catch (error) {
      console.error("Error al obtener doctores con filtros:", error);
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
            this.getDocsWithFilters();
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

  async loadPatientData() {
    try {
      this.patient = await firstValueFrom(this._usersService.getPatient(this.user.email));
      this.patient.detalles?.forEach(p => this.problemas.push(p));
      this.problemasPaciente = [...this.problemas];
    } catch (error) {
      console.error("Error al obtener los datos del paciente:", error);
    }
  }
  

  toggleVisibility() {
    this.isDetailsVisible = !this.isDetailsVisible;
  }

}
