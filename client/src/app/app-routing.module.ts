import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { DonorComponent } from './donor/donor.component';
import { DoctorComponent } from './doctor/doctor.component';
import { TechnicianComponent } from './technician/technician.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './core/auth/auth.guard';
import { DonorEditComponent } from './donor/donor-register/donor-edit.component';
import { DoctorRegisterComponent } from './doctor/doctor-register/doctor-register.component';
import { TechnicianRegisterComponent } from './technician/technician-register/technician-register.component';
//import { DonorHistoryComponent } from './donor/donor-history/donor-history.component';
import { DonorDetailsMedicalEditComponent } from './donor/donor-details-medical-edit/donor-details-medical-edit.component';
import { DonorDetailsPersonalEditComponent } from './donor/donor-details-personal-edit/donor-details-personal-edit.component';
//import { DoctorListForDonorComponent } from './doctor/doctor-list-for-donor/doctor-list-for-donor.component';
import { DoctorListForAdminComponent } from './admin/doctor-list-for-admin/doctor-list-for-admin.component';
import { TechnicianListForAdminComponent } from './admin/technician-list-for-admin/technician-list-for-admin.component';
import { DonorListForAdminComponent } from './admin/donor-list-for-admin/donor-list-for-admin.component';
import { DonorListForDoctorComponent } from './doctor/donor-list-for-doctor/donor-list-for-doctor.component';
import { ViewAllHospitalsComponent } from './admin/ViewAllHospitals.component';
import { InsertHospitalComponent } from './admin/InsertHospital.component';
import { GetStocksBelowThresholdComponent } from './admin/GetStocksBelowThreshold.component';
import { GeoButtonComponent } from './donor/Geobutton/geo-button.component';
import { ScreenDonorComponent } from './doctor/screendonor.component';
import { BloodCollectionComponent } from './doctor/bloodcollection.component';
import { BloodTestComponent } from './technician/bloodtest.component';
import { ReadBloodBagComponent } from './technician/readbloodbag.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'donor/edit/:self',
    component: DonorEditComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'donor/:donorId/details/personal/edit',
    component: DonorDetailsPersonalEditComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'donor/:donorId/details/medical/edit',
    component: DonorDetailsMedicalEditComponent,
    canActivate: [ AuthGuard ]
  },
  /*{
    path: 'donor/:donorId/doctors/list',
    component: DoctorListForDonorComponent,
    canActivate: [ AuthGuard ]
  },*/
  {
    path: 'donor/:donorId',
    component: DonorComponent,
    canActivate: [ AuthGuard ]
  },
   {
    path: 'donor/view/:adminId',
    component: DonorListForAdminComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'donor/:donorId/:doctorId',
    component:DonorComponent,
    canActivate: [ AuthGuard ]
  },
  /*{
    path: 'donor/:donorId/history',
    component: DonorHistoryComponent,
    canActivate: [ AuthGuard ]
  },*/
  {
    path: 'doctor/register',
    component: DoctorRegisterComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'doctor/view/:adminId',
    component: DoctorListForAdminComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'technician/view/:adminId',
    component: TechnicianListForAdminComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'technician/register',
    component: TechnicianRegisterComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'doctor/:doctorId',
    component: DoctorComponent,
    canActivate: [ AuthGuard ]
  },
   {
    path: 'technician/:technicianId',
    component: TechnicianComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'doctor/:doctorId/donors',
    component: DonorListForDoctorComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'donor/screen/:donorId/:doctorId/:dob',
    component: ScreenDonorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'donor/collect-blood/:donorId/:doctorId',
    component: BloodCollectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path : 'technician/:technicianId/bloodbags',
    component: BloodTestComponent,
    canActivate: [AuthGuard]
  },
  {
    path : 'technician/:technicianId/readbloodbag',
    component: ReadBloodBagComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/:adminId',
    component: AdminComponent
  },
  {
    path: 'viewHospitals',
    component: ViewAllHospitalsComponent
  },
  {
    path: 'addHospital',
    component: InsertHospitalComponent
  },
  {
    path: 'displayStocksBelowThreshold',
    component: GetStocksBelowThresholdComponent
  }
];

@NgModule({
  imports: [FormsModule,RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
