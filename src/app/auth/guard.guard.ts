import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StudentService } from '../service/student.service';
import { studentView } from 'router/models/student/studentView';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {
  constructor(public studentService:StudentService, private router:Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let studentData:studentView = {
      firstName:"",
      lastName:"",
      email:"",
      password:"",
      errorMessage:"",
      token:"",
      joinApproval:false
    }
    if(typeof(localStorage.getItem("token"))=="string")
    {
      studentData.token = String(localStorage.getItem("token"));
      this.studentService.getData(studentData).subscribe((res)=>{
        studentData.errorMessage = res.errorMessage;
      });
    }
    else
    {
      this.router.navigateByUrl("/");
      return false;
    }
    if(studentData.errorMessage == "")
    {
      return true;
    }
    else
    {
      localStorage.removeItem("token");
      this.router.navigateByUrl("/");
      return false;
    }
  }
  
}
