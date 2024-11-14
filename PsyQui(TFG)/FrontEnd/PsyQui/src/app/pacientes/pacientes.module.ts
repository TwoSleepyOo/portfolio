import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ComponentesModule } from '../componentes/componentes.module';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { CitasComponent } from './citas/citas.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
     HomeComponent,
     BusquedaComponent,
     CitasComponent
    ],
  imports: [
    CommonModule,
    ComponentesModule,
    ReactiveFormsModule
  ]
})
export class PacientesModule { }
