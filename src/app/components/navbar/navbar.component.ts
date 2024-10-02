import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/service/student.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public isLogedIn():boolean {
    let token:string | null = localStorage.getItem("token");
    let adminToken:string | null = localStorage.getItem("adminToken");
    if(typeof(token) == "string" || typeof(adminToken) == "string")
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  public logOut()
  {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
  }
}
