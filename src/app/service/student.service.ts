import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { studentView } from 'router/models/student/studentView';
import { Observable } from 'rxjs';
import config from 'router/config';
@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private httpClient:HttpClient) { }
  public register(studentData:studentView):Observable<studentView> {
    let url:string = `http://${config.HOST_NAME}:${config.PORT}/api/student/register`;
    return this.httpClient.post<studentView>(url,studentData);
  }
  public login(studentData:studentView):Observable<studentView> {
    let url:string = `http://${config.HOST_NAME}:${config.PORT}/api/student/login`;
    return this.httpClient.post<studentView>(url,studentData);
  }
  public getData(studentData:studentView):Observable<studentView> {
    let url:string = `http://${config.HOST_NAME}:${config.PORT}/api/student/get-student`;
    return this.httpClient.post<studentView>(url,studentData);
  }
}
