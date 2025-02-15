import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from 'router/config';
import { adminView } from 'router/models/admin/adminView';
import { studentView } from 'router/models/student/studentView';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient:HttpClient) { }
  public login(adminData:adminView):Observable<adminView> {
    let url:string = `http://${config.HOST_NAME}:${config.PORT}/api/admin/login`;
    return this.httpClient.post<adminView>(url,adminData);
  }
  public getData(adminData:adminView):Observable<adminView> {
    let url:string = `http://${config.HOST_NAME}:${config.PORT}/api/admin/get-data`;
    return this.httpClient.post<adminView>(url,adminData);
  }
  public getstudentData(adminData:adminView):Observable<studentView[]> {
    let url:string = `http://${config.HOST_NAME}:${config.PORT}/api/admin/get-student`;
    return this.httpClient.post<studentView[]>(url,adminData);
  }
  public approveStudent(studentData:studentView):Observable<studentView> {
    let url:string = `http://${config.HOST_NAME}:${config.PORT}/api/admin/join-approval`;
    return this.httpClient.post<studentView>(url,studentData);
  }
  public studentDeletion(studentData:studentView):Observable<studentView> {
    let url:string = `http://${config.HOST_NAME}:${config.PORT}/api/admin/delete-student`;
    return this.httpClient.post<studentView>(url,studentData);
  }
}
