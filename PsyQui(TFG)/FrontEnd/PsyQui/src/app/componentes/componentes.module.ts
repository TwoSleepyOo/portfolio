import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPacienteComponent } from './header-paciente/header-paciente.component';
import { FooterPacienteComponent } from './footer-paciente/footer-paciente.component';
import { HeaderDoctorComponent } from './header-doctor/header-doctor.component';
import { FooterDoctorComponent } from './footer-doctor/footer-doctor.component';
import { NotFoundComponent } from './not-found/not-found.component';



@NgModule({
  declarations: [
    HeaderPacienteComponent,
    FooterPacienteComponent,
    HeaderDoctorComponent,
    FooterDoctorComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    HeaderPacienteComponent,
    FooterPacienteComponent,
    HeaderDoctorComponent,
    FooterDoctorComponent,
    NotFoundComponent
  ]
})
export class ComponentesModule { }
