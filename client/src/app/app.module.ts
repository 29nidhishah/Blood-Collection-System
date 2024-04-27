import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { DonorComponent } from './donor/donor.component';
import { DoctorComponent } from './doctor/doctor.component';
import { TechnicianComponent } from './technician/technician.component';
import { AuthService } from './core/auth/auth.service';
import { AuthGuard } from './core/auth/auth.guard';
import { TokenInterceptorService } from './core/auth/token-interceptor.service';
import { ToolbarButtonComponent, ToolbarLinkComponent, ToolbarComponent } from './sidebar';
import { SearchComboComponent, SearchService, SearchTextComponent } from './search';
import { AdminService } from './admin/admin.service';
import { DonorService } from './donor/donor.service';
import { DoctorService } from './doctor/doctor.service';
import { TechnicianService } from './technician/technician.service';
import { DonorEditComponent } from './donor/donor-register/donor-edit.component';
import { DoctorRegisterComponent } from './doctor/doctor-register/doctor-register.component';
import { TechnicianRegisterComponent } from './technician/technician-register/technician-register.component';
import { DonorHistoryComponent } from './donor/donor-history/donor-history.component';
import { DonorDetailsMedicalEditComponent } from './donor/donor-details-medical-edit/donor-details-medical-edit.component';
import { DonorDetailsPersonalEditComponent } from './donor/donor-details-personal-edit/donor-details-personal-edit.component';
import { DoctorListForDonorComponent } from './doctor/doctor-list-for-donor/doctor-list-for-donor.component';
import { DoctorListForAdminComponent } from './admin/doctor-list-for-admin/doctor-list-for-admin.component';
import { TechnicianListForAdminComponent } from './admin/technician-list-for-admin/technician-list-for-admin.component';
import { DonorListForAdminComponent } from './admin/donor-list-for-admin/donor-list-for-admin.component';
import { DonorListForDoctorComponent } from './doctor/donor-list-for-doctor/donor-list-for-doctor.component';
import { LoadingPipe } from './loading.pipe';
import { ViewAllHospitalsComponent } from './admin/ViewAllHospitals.component';
import { InsertHospitalComponent } from './admin/InsertHospital.component';
import { GetStocksBelowThresholdComponent } from './admin/GetStocksBelowThreshold.component';
import { GeoButtonComponent } from './donor/Geobutton/geo-button.component';
import { ScreenDonorComponent } from './doctor/screendonor.component';
import { BloodCollectionComponent } from './doctor/bloodcollection.component';
import { BloodTestComponent } from './technician/bloodtest.component';
import { ReadBloodBagComponent } from './technician/readbloodbag.component';

const components = [
  AppComponent,
  LoginComponent,
  AdminComponent,
  DonorComponent,
  TechnicianComponent,
  DonorEditComponent,
  DonorHistoryComponent,
  DonorDetailsMedicalEditComponent,
  DonorDetailsPersonalEditComponent,
  DonorListForDoctorComponent,
  DoctorListForDonorComponent,
  DoctorListForAdminComponent,
  TechnicianListForAdminComponent,
  DonorListForAdminComponent,
  DoctorComponent,
  DoctorRegisterComponent,
  TechnicianRegisterComponent,
  ToolbarComponent,
  ToolbarButtonComponent,
  ToolbarLinkComponent,
  SearchComboComponent,
  SearchTextComponent,
  ViewAllHospitalsComponent,
  InsertHospitalComponent,
  GetStocksBelowThresholdComponent,
  GeoButtonComponent,
  ScreenDonorComponent,
  BloodCollectionComponent,
  BloodTestComponent,
  ReadBloodBagComponent
];

const pipes = [
  LoadingPipe
];

@NgModule({
  declarations: [...components, ...pipes],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbTooltipModule
  ],
  providers: [ AuthService, AuthGuard, SearchService, AdminService, DonorService, DoctorService, TechnicianService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
