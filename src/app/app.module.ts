import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { environment } from 'src/environments/environment';
import { AddCarComponent } from './add-car/add-car.component';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from './services/firebase.service';
import { CrudService } from './services/crud.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddCarComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    FormsModule,
  ],
  providers: [
    FirebaseService,
    CrudService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
