import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { StudentRegisterComponent } from './components/student-register/student-register.component';
import { StudentLoginComponent } from './components/student-login/student-login.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashBoardComponent } from './components/admin-dash-board/admin-dash-board.component';
import { GuardGuard } from './auth/guard.guard';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"student/dashboard",component:DashBoardComponent,canActivate:[GuardGuard]},
  {path:"student/register",component:StudentRegisterComponent},
  {path:"student/login",component:StudentLoginComponent},
  {path:"admin/login",component:AdminLoginComponent},
  {path:"admin/dashboard",component:AdminDashBoardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
