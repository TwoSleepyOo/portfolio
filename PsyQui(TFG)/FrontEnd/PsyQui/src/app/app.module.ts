import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { PacientesModule } from './pacientes/pacientes.module';
import { DoctoresModule } from './doctores/doctores.module';
import { CookieService } from 'ngx-cookie-service';
import { BbddService } from './services/users.service';
import { ComponentesModule } from './componentes/componentes.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule, 
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    LoginModule,
    PacientesModule,
    DoctoresModule,
    ComponentesModule,
    RouterModule
  ],
  providers: [BbddService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
