import { Component, OnInit } from '@angular/core';
import { adminView } from 'router/models/admin/adminView';
import { studentView } from 'router/models/student/studentView';
import { testView } from 'router/models/test/testView';
import { AdminService } from 'src/app/service/admin.service';
import { TestService } from 'src/app/service/test.service';
@Component({
  selector: 'app-admin-dash-board',
  templateUrl: './admin-dash-board.component.html',
  styleUrls: ['./admin-dash-board.component.css']
})
export class AdminDashBoardComponent implements OnInit {
  public adminData:adminView = {
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    token:"",
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
  public studentActive = true;
  public allTestData:testView[] = [] as testView[];
  public studentData:studentView[] = [] as studentView[];
  constructor(private adminService:AdminService, private testService:TestService) { }

  ngOnInit(): void {
    if(typeof(localStorage.getItem("adminToken")) == "string")
    {
      this.adminData.token = String(localStorage.getItem("adminToken"));
      this.testData.token = String(localStorage.getItem("adminToken"));
      this.adminService.getDataa(this.adminData).subscribe((res)=>{
        if(res.errorMessage != "")
        {
          location.href = "/"
        }
        else
        {
          this.adminService.getstudentData(this.adminData).subscribe((res)=>{
            this.studentData = res;
          });
          this.testService.allTestData(this.testData).subscribe((res)=>{
            this.allTestData = res;
          });
        }
      });
    }
    else
    {
      location.href = "/";
    }
  }
  public approve(student:studentView) {
    student.token = this.adminData.token;
    this.adminService.approveStudent(student).subscribe((res)=>{
      location.reload();
    });
  }
  public delete(student:studentView) {
    student.token = this.adminData.token;
    this.adminService.studentDeletion(student).subscribe((res)=>{
    });
    location.href="/admin/dashboard"
  }
  public student() {
    document.querySelector("#studentBtn")?.classList.add("active");
    document.querySelector("#testBtn")?.classList.remove("active");
    this.studentActive = true;
  }
  public test() {
    document.querySelector("#studentBtn")?.classList.remove("active");
    document.querySelector("#testBtn")?.classList.add("active");
    this.studentActive = false;
  }
  public clearAll() {
    this.testService.clear(this.testData).subscribe((res)=>{
      location.reload();
    });
  }
  public submitTestData() {
    this.testService.insert(this.testData).subscribe((res)=>{
      if(res.errorMessage != "")
      {
        this.testData.errorMessage = res.errorMessage;
      }
      else
      {
        location.reload();
      }
    });
  }
}
