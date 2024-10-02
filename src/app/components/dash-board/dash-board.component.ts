import { Component, OnInit } from '@angular/core';
import { studentView } from 'router/models/student/studentView';
import { testView } from 'router/models/test/testView';
import { StudentService } from 'src/app/service/student.service';
import { TestService } from 'src/app/service/test.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  public studentData:studentView = {
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    token:"",
    joinApproval:false,
    errorMessage:""
  }
  public testData:testView = {
    email:"",
    maths:0,
    physics:0,
    chemistry:0,
    total:0,
    token:"",
    errorMessage:""
  }
  public data = {
    maths:0,
    physics:0,
    chemistry:0,
    total:0
  }
  constructor(private studentService:StudentService, private testService:TestService) { }

  ngOnInit(): void {
    if(typeof(localStorage.getItem("token"))=="string")
    {
      this.studentData.token = String(localStorage.getItem("token"));
      this.studentService.getData(this.studentData).subscribe((res)=>{
        this.studentData = {
          ...res
        }
      });
      this.testData.token = this.studentData.token;
      this.testService.testResults(this.testData).subscribe((res)=>{
        this.testData = {
          ...res
        }
        this.data = {
          maths:parseInt(String(this.testData.maths))/50*100,
          physics:parseInt(String(this.testData.physics))/25*100,
          chemistry:parseInt(String(this.testData.chemistry))/25*100,
          total:parseInt(String(this.testData.total))/100*100,
        }
      });
    }
    if(this.studentData.errorMessage !="")
    {
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      location.reload();
    }
  }

}
