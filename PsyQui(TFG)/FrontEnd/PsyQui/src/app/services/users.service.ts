import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, last, lastValueFrom, of, throwError } from 'rxjs';
import { Appointment, Doctor, NotAvailable, Patient, Pending, Relation, User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class BbddService {
  private myAppURL = "https://localhost:7053/"
  private myApiURLusers = "api/users/"
  private myApiURLpatients = "api/patients/"
  private myApiURLdoctors = "api/doctors/"
  private myApiURLrelations = "api/relations/"
  private myApiURLpending = "api/pending/"
  private myApiURLappointments = "api/citas/";

  constructor(private http:HttpClient) { }

  getListUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.myAppURL + this.myApiURLusers);
  }

  getListPatients():Observable<Patient[]>{
    return this.http.get<Patient[]>(this.myAppURL + this.myApiURLpatients);
  }
  
  getListDocs():Observable<Doctor[]>{
    return this.http.get<Doctor[]>(this.myAppURL + this.myApiURLdoctors);
  }

  getListRelations():Observable<Relation[]>{
    return this.http.get<Relation[]>(this.myAppURL + this.myApiURLrelations);
  }

  getListPendings():Observable<Pending[]>{
    return this.http.get<Pending[]>(this.myAppURL + this.myApiURLpending);
  }

  getUser(id: number, password: string): Observable<{ guid: string | null }> {
    return this.http.get<{ guid: string | null }>(`${this.myAppURL}${this.myApiURLusers}${id},${password}`);
  }

  getDoctor(email: string): Observable<Doctor> {
    const encodedEmail = encodeURIComponent(email);
    return this.http.get<Doctor>(`${this.myAppURL}${this.myApiURLdoctors}email/${encodedEmail}`);
  }
  
  getPatient(email: string): Observable<Patient> {
    const encodedEmail = encodeURIComponent(email);
    return this.http.get<Patient>(`${this.myAppURL}${this.myApiURLpatients}email/${encodedEmail}`);
  }


  getRelation(id:number):Observable<Relation>{
    return this.http.get<Relation>(`${this.myAppURL}${this.myApiURLrelations}${id}`);
  }

  getPending(id:number):Observable<Pending>{
    return this.http.get<Pending>(`${this.myAppURL}${this.myApiURLpending}${id}`);
  }

  getPatientById(idPatient: number | undefined): Observable<Patient> {
    return this.http.get<Patient>(`${this.myAppURL}${this.myApiURLpatients}id/${idPatient}`);
  }

  getDoctorById(idDoc:number):Observable<Doctor>{
    return this.http.get<Doctor>(`${this.myAppURL}${this.myApiURLdoctors}id/${idDoc}`)
  }


  getPendingDoc(idDoc: number): Observable<Pending[]> {
    return this.http.get<Pending[]>(`${this.myAppURL}${this.myApiURLpending}idDoc/${idDoc}`);
  }

  getPendingPatient(idPatient: number | undefined): Observable<Pending[]> {
    return this.http.get<Pending[]>(`${this.myAppURL}${this.myApiURLpending}idPatient/${idPatient}`);
  }

  getPendingId(id: number): Observable<Pending> {
    return this.http.get<Pending>(`${this.myAppURL}${this.myApiURLpending}id/${id}`);
  }

  getRelationByPatient(id:number | undefined): Observable<Relation> {
    return this.http.get<Relation>(`${this.myAppURL}${this.myApiURLrelations}id/${id}`);
  }

  getRelationsByDoc(id:number |undefined): Observable<Relation[]> {
    return this.http.get<Relation[]>(`${this.myAppURL}${this.myApiURLrelations}idDoc/${id}`)
  }

  getCitasForPatient(id:number | undefined): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.myAppURL}${this.myApiURLappointments}citasPatient/${id}`);
  }

  getNotAvailableByDoc(idDoc:number | undefined):Observable<NotAvailable[]> {
    return this.http.get<NotAvailable[]>(`${this.myAppURL}${this.myApiURLappointments}noDisponibles/${idDoc}`);
  }

  addUser(user: User): Promise<User> {
    return lastValueFrom(this.http.post<User>(`${this.myAppURL}${this.myApiURLusers}`, user));
  }

  addPatient(patient: Patient): Promise<Patient> {
    return lastValueFrom(this.http.post<Patient>(`${this.myAppURL}${this.myApiURLpatients}`, patient));
  }

  addDoc(doctor: Doctor): Promise<Doctor> {
    return lastValueFrom(this.http.post<Doctor>(`${this.myAppURL}${this.myApiURLdoctors}`, doctor));
  }

  addPending(pending:Pending):Promise<Pending>{
    return lastValueFrom(this.http.post<Pending>(`${this.myAppURL}${this.myApiURLpending}`, pending));
  }

  addRelation(relation:Relation):Promise<Relation>{
    return lastValueFrom(this.http.post<Relation>(`${this.myAppURL}${this.myApiURLrelations}`, relation));
  }

  addAppointment(appointment:Appointment): Promise<Appointment> {
    return lastValueFrom(this.http.post<Appointment>(`${this.myAppURL}${this.myApiURLappointments}Appointment/`, appointment));
  }

  addNotAvailable(NotAvailable:NotAvailable): Promise<NotAvailable> {
    return lastValueFrom(this.http.post<NotAvailable>(`${this.myAppURL}${this.myApiURLappointments}noDisponibles/`, NotAvailable));
  }

  checkSession(guid: string): Observable<User> {
    return this.http.get<User>(`${this.myAppURL}${this.myApiURLusers}CheckSession/${guid}`);
  }  

  GetPatients(IdDoc:number):Observable<Relation[]>{
    return this.http.get<Relation[]>(`${this.myAppURL}${this.myApiURLrelations}GetPatients/${IdDoc}`);
  }

  getDoctorsByPatientDetails(patient: Patient): Observable<Doctor[]> {
    return this.http.post<Doctor[]>(`${this.myAppURL}${this.myApiURLdoctors}match-doctors`, patient);
  }

  getDoctorsBySpecialties(specialties: string[]): Observable<Doctor[]> {
    return this.http.post<Doctor[]>(`${this.myAppURL}${this.myApiURLdoctors}by-specialties`, specialties);
  }

  GetCitasDoc(idDoc: number | undefined): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.myAppURL}${this.myApiURLappointments}citasDoc/${idDoc}`);
  }

  getCitasFecha(fecha:string | undefined): Observable<Appointment[]>{
    return this.http.get<Appointment[]>(`${this.myAppURL}${this.myApiURLappointments}citasFechaHora/${fecha}`);
  }

  delPending(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppURL}${this.myApiURLpending}${id}`);
  }

  delAppointment(id:number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.myAppURL}${this.myApiURLappointments}delCita/${id}`);
  }

  delAppointmentByDate(fecha:string | undefined): Observable<void> {
    return this.http.delete<void>(`${this.myAppURL}${this.myApiURLappointments}delForFecha/${fecha}`);
  }

  updatePendingStatus(id: number | undefined, estado: string): Observable<Pending> {
    return this.http.put<Pending>(`${this.myAppURL}${this.myApiURLpending}${id}`, { estado });
  }

  updateNotasFromRelation(id: number | undefined, notas:string): Observable<Relation> {
    return this.http.put<Relation>(`${this.myAppURL}${this.myApiURLrelations}${id}`, {notas});
  }

  updateAppointment(id:number | undefined, estado:string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.myAppURL}${this.myApiURLappointments}cambiarEstado/${id}`, {estado});
  }

}
