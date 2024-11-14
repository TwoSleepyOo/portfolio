import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Doctor, User } from 'src/app/interfaces/user';
import { BbddService } from 'src/app/services/users.service';

@Component({
  selector: 'app-inicio-doc',
  templateUrl: './inicio-doc.component.html',
  styleUrl: './inicio-doc.component.css'
})
export class InicioDocComponent implements OnInit{

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
  especialidadesDoc: string[] = []
  login:FormGroup;
  usersList:User [] = [];
  docsList:Doctor [] = [];
  userReg: User = {
    email: "",
    password: "",
    tipo: "Doctor"
  };
  doctorReg:Doctor = {
    email: '',
    nombre:'',
    apellidos:'',
    genero:'',
    fecha_nac:'',
    telefono:'',
    provincia:'',
    modalidad:''
  };
  retorno:boolean = false;
  signUp:FormGroup;
  registro:boolean = false;
  generatedGUID:string = "";
  modalidades = [
    { nombre: 'A distancia', valor: 'distancia' },
    { nombre: 'Mixta', valor: 'mixta' },
    { nombre: 'Presencial', valor: 'presencial' }
  ]

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
  constructor(private _usersService:BbddService, private toastr:ToastrService, private fb:FormBuilder, private router:Router, private cookies:CookieService){
    this.login = this.fb.group({
      email: [''],
      password: ['']
    });
    this.signUp = this.fb.group({
      nombre:[''],
      apellidos:[''],
      email:[''],
      genero:[''],
      password:[''],
      passwordRep:[''],
      fecha_nac:[''],
      telefono:[''],
      modalidad:[''],
      provincia:[''],
      domicilio:['']
    })
  }

  ngOnInit() {
    this.getUsers();
  }

  getUser(id:number, password:string){
    this._usersService.getUser(id,password).subscribe(
      
    )
  }

  getUsers(){
    this._usersService.getListUsers().subscribe(data=>{
      this.usersList = data;
    })
  }

  getDocs(){
    this._usersService.getListDocs().subscribe(data=>{
      this.docsList = data;
    })
  }

  async registroDoctor(){
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
      direccion: this.signUp.get('domicilio')?.value,
      modalidad: this.signUp.get('modalidad')?.value
    }

    for (const [key, value] of Object.entries(user)) {
      if (key != 'direccion' && !value) {
        console.log(key)
          this.toastr.error('Todos los campos son obligatorios, excepto la dirección si la modalidad es a distancia', 'Campo vacío');
          return;
      }
    }

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(user.email)) {
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
  
    for (var i = 0;i<this.docsList.length; i++){
      if(this.docsList[i].telefono == user.telefono){
        this.toastr.error('Escribe un nuevo número de teléfono','Ese número de teléfono ya está registrado')
        return;
      }
    }

    if(user.modalidad != 'distancia' && user.direccion === ''){
      this.toastr.error('Puede ser tu casa si es donde tienes tu consulta, pero al no ser a distancia de forma integra tienes que decirnos una dirección','Necesitas especificar la dirección de tu consulta')
    }

    this.userReg = {
      email: user.email,
      password: user.password,
      tipo: 'Doctor'
    }

    this.doctorReg = {
      email: user.email,
      nombre: user.nombre,
      apellidos: user.apellidos,
      genero: user.genero,
      fecha_nac: user.fecha_nac,
      telefono: user.telefono,
      provincia: user.provincia,
      modalidad: user.modalidad
    }

    if(user.direccion != ''){
      this.doctorReg.direccion = user.direccion
    }
    if(this.especialidadesDoc.length != 0){
      this.doctorReg.especialidades = this.especialidadesDoc;
    }
    console.log(this.userReg)
    console.log(this.doctorReg);
    await this._usersService.addUser(this.userReg);
    await this._usersService.addDoc(this.doctorReg);
    this.toastr.success("En breve te redigiremos al inicio","Registro completado con éxito");
    this.router.navigate(['/inicioDoc']);
    return;

  }

  registroDoc(){
    this.registro = true;
  }
  
  volverRegistro(){
    this.registro = false;
  }

  onCheckboxChange(problema:string){
    if(this.especialidadesDoc.includes(problema)){
      let pos = this.especialidadesDoc.indexOf(problema);
      this.especialidadesDoc.splice(pos);
    }
    else{
      this.especialidadesDoc.push(problema);
    }
  }

  async comprobarIni(){
    if(this.retorno) {
      this.cookies.set("Session",this.generatedGUID,3600*1000)
      this.router.navigate(["/HomeDoc"]);
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
        if (this.usersList[i].email.toLowerCase() === user.email.toLowerCase() && this.usersList[i].tipo !== "Paciente") {
            foundUser = true;
            try {
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
            } catch (error) {
                console.error(error);
            }
        }
    }
    if (!foundUser) {
        this.toastr.error('El email no existe o es un email de paciente', 'Email incorrecto!');
    }
}
}
