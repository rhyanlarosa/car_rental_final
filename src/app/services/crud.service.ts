import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  user: string;
  constructor(public fireservices: AngularFirestore, public firebaseAuth : AngularFireAuth) {
    this.firebaseAuth.user.subscribe((data => {
      this.user = data.uid;
    }))
  }

  addCar(Record:any){
    return this.fireservices.collection('cars').add(Record);
  }

  getCar(){
    return this.fireservices.collection('cars').snapshotChanges();
  }

  updateRentCar(carID:string){
    this.fireservices.collection('cars').doc(carID).update({
      carRented : this.user,
      dateRent : Date.now(),
    });
  }

  returnRentCar(carID:string){
    return (this.fireservices.collection('cars').doc(carID).snapshotChanges())
  }
}
