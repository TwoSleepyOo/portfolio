import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Patient, User } from 'src/app/interfaces/user';
import { BbddService } from 'src/app/services/users.service';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-registro-personalizado',
  templateUrl: './registro-personalizado.component.html',
  styleUrl: './registro-personalizado.component.css'
})
export class RegistroPersonalizadoComponent implements OnInit {
  @ViewChild('comentario', { static: false }) comentarioInput!: ElementRef;
  problemasNoDiagnosticables = [
    { nombre: 'Esquizofrenia', valor: 'Esquizofrenia' },
    { nombre: 'TOC', valor: 'TOC' },
    { nombre: 'TEA', valor: 'TEA' },
    { nombre: 'TEPT', valor: 'TEPT' },
    { nombre: 'Trastorno bipolar', valor: 'Trastorno bipolar' },
    { nombre: 'TLP', valor: 'TLP' },
    { nombre: 'TID', valor: 'TID' },
    { nombre: 'TPA o Psicopatía', valor: 'TPA o Psicopatia' }
  ];
  problemasDiagnosticables = [
    { nombre: 'Ansiedad', valor: 'Ansiedad' },
    { nombre: 'Depresión', valor: 'Depresion' },
    { nombre: 'Problemas de adicción', valor: 'Problemas de adiccion' },
    { nombre: 'Control de la ira', valor: 'Control de la ira' },
    { nombre: 'Hipersexualidad', valor: 'Hipersexualidad' },
    { nombre: 'Bullying/Discriminación', valor: 'Bullying/Discriminacion' },
    { nombre: 'Trastorno alimenticio', valor: 'Trastorno alimenticio' },
    { nombre: 'Violencia de Género/Intrafamiliar', valor: 'Violencia de Genero/Intrafamiliar' }
  ];
  problemasPaciente: string[] = [];
  maxNoDiagnosticables = 3;
  maxDiagnosticables = 1;
  selectedNoDiagnosticables = 0;
  selectedDiagnosticables = 0;
  comentario: string = "";
  progreso: number = 0;
  eleccion: string = "vacio";
  pasoAnteriorProgreso: number = 0;
  signUp:FormGroup;
  usersList:User [] = [];
  patientsList: Patient [] = [];
  userReg:User = {
    email: '',
    password: '',
    tipo: 'Paciente'
  };
  patientReg:Patient = {
    email: '',
    nombre:'',
    apellidos:'',
    genero:'',
    fecha_nac:'',
    telefono:'',
    provincia:''
  };

  constructor(private _usersService:BbddService, private toastr:ToastrService, private fb:FormBuilder, private router:Router){
    this.signUp = this.fb.group({
      nombre:[''],
      apellidos:[''],
      email:[''],
      genero:[''],
      password:[''],
      passwordRep:[''],
      fecha_nac:[''],
      telefono:[''],
      provincia:[''],
      domicilio:['']
    })
  }

  onCheckboxChange(problema: string, group: string){
    const checkbox = document.getElementById(problema) as HTMLInputElement;
    if ((group === 'noDiagnosticables' && this.selectedNoDiagnosticables === this.maxNoDiagnosticables) && checkbox.checked || (group === 'diagnosticables' && this.selectedDiagnosticables === this.maxDiagnosticables) && checkbox.checked) {
      if (checkbox) {
        checkbox.checked = false;
      }
      this.toastr.info('Sólo puedes marcar 3 no diagnosticables o 1 diagnosticable','Has alcanzado el límite de selecciones')
      return;
    }
    this.eleccion = group
      if(group == "noDiagnosticables"){
        if(!this.problemasPaciente.includes(problema)){
          this.problemasPaciente.push(problema);
          this.selectedNoDiagnosticables++;
        }
        else{
          let pos = this.problemasPaciente.indexOf(problema);
          this.problemasPaciente.splice(pos);
          this.selectedNoDiagnosticables--;
          if(this.problemasPaciente.length === 0){
            this.eleccion = 'vacio';
          }
        }
      }
      if(group == "diagnosticables"){
        if(!this.problemasPaciente.includes(problema)){
          this.problemasPaciente.push(problema);
          this.selectedDiagnosticables++;
        }
        else{
          let pos = this.problemasPaciente.indexOf(problema);
          this.problemasPaciente.splice(pos);
          this.selectedDiagnosticables--;
          this.eleccion = 'vacio';
        }
      }
  }

  ngOnInit() {
    this.getUsers();
    this.getPatients();
  }

  getUsers(){
    this._usersService.getListUsers().subscribe(data=>{
      this.usersList = data;
    })
  }

  getPatients(){
    this._usersService.getListPatients().subscribe(data=>{
      this.patientsList = data;
    })
  }

  registro(){
    const user:any = {
      email: this.signUp.get('email')?.value,
      password: this.signUp.get('password')?.value,
      passwordRep: this.signUp.get('passwordRep')?.value,
      nombre: this.signUp.get('nombre')?.value,
      apellidos: this.signUp.get('apellidos')?.value,
      genero: this.signUp.get('genero')?.value,
      fecha_nac: this.signUp.get('fecha_nac')?.value,
      telefono: this.signUp.get('telefono')?.value,
      provincia: this.signUp.get('provincia')?.value,
      domicilio: this.signUp.get('domicilio')?.value
    }

    for (const [key, value] of Object.entries(user)) {
      if (key !== 'domicilio' && !value) {
          this.toastr.error('Todos los campos son obligatorios, excepto el domicilio', 'Campo vacío');
          return;
      }
    }

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(user.email)) {
      console.log(user)
      this.toastr.error('No corresponde con el formato de un email','El correo no es válido')
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

    if(user.password != user.passwordRep){
      this.toastr.error('Vuelve a escribirla','Las contraseñas no coinciden');
      return;
    }

    const regexTelefono = /(?:[0-9] ?){6,14}[0-9]$/;
    if (!regexTelefono.test(user.telefono)) {
      this.toastr.error('El formato del teléfono no es válido','Recuerda que debe ser un número que exista')
      return;
    }
  
    for (var i = 0;i<this.patientsList.length; i++){
      if(this.patientsList[i].telefono == user.telefono){
        this.toastr.error('Escribe un nuevo número de teléfono','Ese número de teléfono ya está registrado')
        return;
      }
    }

    this.userReg = {
      email: user.email,
      password: user.password,
      tipo: 'Paciente'
    }

    this.patientReg = {
      email: user.email,
      nombre: user.nombre,
      apellidos: user.apellidos,
      genero: user.genero,
      fecha_nac: user.fecha_nac,
      telefono: user.telefono,
      provincia: user.provincia,
    }

    if(user.domicilio != ''){
      this.patientReg.domicilio = user.domicilio
    }
    this.siguientePaso();
    return;

  }

  deshacerSelecciones(){
    this.problemasPaciente = []
    this.selectedDiagnosticables = 0;
    this.selectedNoDiagnosticables = 0;
    this.eleccion = 'vacio';
    this.pasoAnterior();
  }

  guardarSelecciones(){
    this.patientReg.detalles = this.problemasPaciente;
    this.siguientePaso();
  }

  async guardarComentario() {
    this.comentario = this.comentarioInput.nativeElement.value;
    this.patientReg.comentario = this.comentario;
  
    try {
      await this._usersService.addUser(this.userReg);
      await this._usersService.addPatient(this.patientReg);
      this.getUsers();
      this.siguientePaso();
    } catch (error) {
      console.error("Error guardando comentario: ", error);
      this.toastr.error('Ocurrió un error al guardar el comentario', 'Error');
    }
  }

  siguientePaso(){
    this.pasoAnteriorProgreso = this.progreso;
    this.progreso++;
  }

  pasoAnterior(){
    this.pasoAnteriorProgreso = this.progreso;
    this.progreso--;
  }

  opcionesGenero = [
    { nombre: 'Masculino', valor: 'masculino' },
    { nombre: 'Femenino', valor: 'femenino' },
    { nombre: 'Masculino transgénero', valor: 'transgeneroM' },
    { nombre: 'Femenino transgénero', valor: 'transgeneroF'},
    { nombre: 'No binario', valor: 'no_binario' },
    { nombre: 'Otro', valor: 'otro'}
  ];

  opcionesProvincias = [
    { nombre: 'Álava', valor: 'ALAVA' },
    { nombre: 'Albacete', valor: 'ALBACETE' },
    { nombre: 'Alicante', valor: 'ALICANTE' },
    { nombre: 'Almería', valor: 'ALMERIA' },
    { nombre: 'Asturias', valor: 'ASTURIAS' },
    { nombre: 'Ávila', valor: 'AVILA' },
    { nombre: 'Badajoz', valor: 'BADAJOZ' },
    { nombre: 'Barcelona', valor: 'BARCELONA' },
    { nombre: 'Burgos', valor: 'BURGOS' },
    { nombre: 'Cáceres', valor: 'CACERES' },
    { nombre: 'Cádiz', valor: 'CADIZ' },
    { nombre: 'Cantabria', valor: 'CANTABRIA' },
    { nombre: 'Castellón', valor: 'CASTELLON' },
    { nombre: 'Ceuta', valor: 'CEUTA' },
    { nombre: 'Ciudad Real', valor: 'CIUDAD_REAL' },
    { nombre: 'Córdoba', valor: 'CORDOBA' },
    { nombre: 'Cuenca', valor: 'CUENCA' },
    { nombre: 'Girona', valor: 'GIRONA' },
    { nombre: 'Granada', valor: 'GRANADA' },
    { nombre: 'Guadalajara', valor: 'GUADALAJARA' },
    { nombre: 'Guipúzcoa', valor: 'GUIPUZCOA' },
    { nombre: 'Huelva', valor: 'HUELVA' },
    { nombre: 'Huesca', valor: 'HUESCA' },
    { nombre: 'Illes Balears', valor: 'ILLES_BALEAR' },
    { nombre: 'Jaén', valor: 'JAEN' },
    { nombre: 'La Coruña', valor: 'LA_CORUNA' },
    { nombre: 'La Rioja', valor: 'LA_RIOJA' },
    { nombre: 'Las Palmas', valor: 'LAS_PALMAS' },
    { nombre: 'León', valor: 'LEON' },
    { nombre: 'Lleida', valor: 'LLEIDA' },
    { nombre: 'Lugo', valor: 'LUGO' },
    { nombre: 'Madrid', valor: 'MADRID' },
    { nombre: 'Málaga', valor: 'MALAGA' },
    { nombre: 'Melilla', valor: 'MELILLA' },
    { nombre: 'Murcia', valor: 'MURCIA' },
    { nombre: 'Navarra', valor: 'NAVARRA' },
    { nombre: 'Ourense', valor: 'OURENSE' },
    { nombre: 'Palencia', valor: 'PALENCIA' },
    { nombre: 'Pontevedra', valor: 'PONTEVEDRA' },
    { nombre: 'Salamanca', valor: 'SALAMANCA' },
    { nombre: 'Santa Cruz de Tenerife', valor: 'SANTA_CRUZ_DE_TENERIFE' },
    { nombre: 'Segovia', valor: 'SEGOVIA' },
    { nombre: 'Sevilla', valor: 'SEVILLA' },
    { nombre: 'Soria', valor: 'SORIA' },
    { nombre: 'Tarragona', valor: 'TARRAGONA' },
    { nombre: 'Teruel', valor: 'TERUEL' },
    { nombre: 'Toledo', valor: 'TOLEDO' },
    { nombre: 'Valencia', valor: 'VALENCIA' },
    { nombre: 'Valladolid', valor: 'VALLADOLID' },
    { nombre: 'Vizcaya', valor: 'VIZCAYA' },
    { nombre: 'Zamora', valor: 'ZAMORA' },
    { nombre: 'Zaragoza', valor: 'ZARAGOZA' }
  ];
}
