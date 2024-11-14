import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio/inicio.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroFastComponent } from './registro-fast/registro-fast.component';
import { RegistroPersonalizadoComponent } from './registro-personalizado/registro-personalizado.component';
import { InicioDocComponent } from './inicio-doc/inicio-doc.component';



@NgModule({
  declarations: [
    InicioComponent, RegistroFastComponent, RegistroPersonalizadoComponent, InicioDocComponent
  ],
  imports: [
    CommonModule,ReactiveFormsModule
  ],
  exports:[
    InicioComponent, RegistroFastComponent, RegistroPersonalizadoComponent, InicioDocComponent
  ]
})
export class LoginModule { }
