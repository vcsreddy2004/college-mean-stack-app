import { Component, OnInit } from '@angular/core';
import { studentView } from 'router/models/student/studentView';
import { StudentService } from 'src/app/service/student.service';
@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.css']
})
export class StudentRegisterComponent implements OnInit {
  public studentData:studentView = {
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    token:"",
    errorMessage:"",
    joinApproval:false
  };
  public conformPassword:string = "";
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
  public register() {
    if(this.studentData.firstName=="")
    {
      this.studentData.errorMessage = "First name can not left empty";
    }
    else if(this.studentData.lastName=="")
    {
      this.studentData.errorMessage = "Last name can not left empty";
    }
    else if(this.studentData.email=="")
    {
      this.studentData.errorMessage = "Email can not left empty";
    }
    else if(this.studentData.password=="")
    {
      this.studentData.errorMessage = "Password can not left empty";
    }
    else if(this.conformPassword=="")
    {
      this.studentData.errorMessage = "conform Password can not left empty";
    }
    else if(this.studentData.password != this.conformPassword)
    {
      this.studentData.errorMessage = "Password and conform password mismatch";
    }
    else
    {
      this.studentService.register(this.studentData).subscribe((res)=>{
        if(res.errorMessage !="")
        {
          this.studentData.errorMessage = res.errorMessage;
        }
        else
        {
          location.href = "/student/login";
        }
      });
    }
  }
}
