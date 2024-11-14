import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './login/inicio/inicio.component';
import { RegistroFastComponent } from './login/registro-fast/registro-fast.component';
import { RegistroPersonalizadoComponent } from './login/registro-personalizado/registro-personalizado.component';
import { InicioDocComponent } from './login/inicio-doc/inicio-doc.component';
import { HomeComponent } from './pacientes/home/home.component';
import { HomeDocComponent } from './doctores/home-doc/home-doc.component';
import { BusquedaComponent } from './pacientes/busqueda/busqueda.component';
import { PacientesComponent } from './doctores/pacientes/pacientes.component';
import { CitasDocComponent } from './doctores/citas-doc/citas-doc.component';
import { CitasComponent } from './pacientes/citas/citas.component';

const routes: Routes = [
  {path:'', component:InicioComponent},
  {path:'RegistroRap', component:RegistroFastComponent},
  {path:'RegistroPerson', component:RegistroPersonalizadoComponent},
  {path:'inicioDoc', component:InicioDocComponent},
  {path:'Home',component:HomeComponent},
  {path:'HomeDoc',component:HomeDocComponent},
  {path:'Busqueda',component:BusquedaComponent},
  {path:'Pacientes',component:PacientesComponent},
  {path:'CitasDoc', component:CitasDocComponent},
  {path:'Citas', component:CitasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
