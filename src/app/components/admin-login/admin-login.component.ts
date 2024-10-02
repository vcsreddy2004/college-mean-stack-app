import { Component, OnInit } from '@angular/core';
import { adminView } from 'router/models/admin/adminView';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  public adminData: adminView = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    token: "",
    errorMessage: ""
  };

  constructor(private adminService: AdminService) { }

  ngOnInit(): void { }

  public login(): void {
    if (!this.adminData.email) {
      this.adminData.errorMessage = "Email cannot be left empty";
      return;
    }

    if (!this.adminData.password) {
      this.adminData.errorMessage = "Password cannot be left empty";
      return;
    }

    this.adminService.login(this.adminData).subscribe(
      (res) => {
        if (res.errorMessage) {
          // If there's an error message in the response, display it
          this.adminData.errorMessage = res.errorMessage;
        } else {
          // If login is successful, store the token and redirect
          localStorage.setItem("adminToken", res.token);
          location.href = "/admin/dashboard";
        }
      },
      (err) => {
        this.adminData.errorMessage = err.error.errorMessage;
      }
    );
  }
}
