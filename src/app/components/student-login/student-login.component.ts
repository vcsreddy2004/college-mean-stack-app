import { Component, OnInit } from '@angular/core';
import { studentView } from 'router/models/student/studentView';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.css']
})
export class StudentLoginComponent implements OnInit {
  public studentData:studentView = {
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    token:"",
    errorMessage:"",
    joinApproval:false
  };
  constructor(private studentService:StudentService) {
    if(localStorage.getItem("token"))
    {
      this.studentData.token = String(localStorage.getItem("token"));
      this.studentService.getData(this.studentData).subscribe((res)=>{
        location.href = "/";
      },
      (err)=>
      {
        localStorage.removeItem("token");
      }
      );
    }
   }

  ngOnInit(): void {
  }
  public login() {
    if (this.studentData.email == "") {
      this.studentData.errorMessage = "Email cannot be left empty";
    } else if (this.studentData.password == "") {
      this.studentData.errorMessage = "Password cannot be left empty";
    } else {
      this.studentService.login(this.studentData).subscribe(
        (res) => {
          if (res.errorMessage) {
            this.studentData.errorMessage = res.errorMessage;
          } else {
            localStorage.setItem("token", res.token);
            location.href = "/student/dashboard";
          }
        },
        (error) => {
          this.studentData.errorMessage = error.error?.errorMessage || "An error occurred";
        }
      );
    }
  }  
}
