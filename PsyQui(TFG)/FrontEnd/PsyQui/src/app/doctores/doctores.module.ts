import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeDocComponent } from './home-doc/home-doc.component';
import { ComponentesModule } from '../componentes/componentes.module';
import { PacientesComponent } from './pacientes/pacientes.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CitasDocComponent } from './citas-doc/citas-doc.component';




@NgModule({
  declarations: [
    HomeDocComponent,
    PacientesComponent,
    CitasDocComponent
  ],
  imports: [
    CommonModule, 
    ComponentesModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DoctoresModule { }
