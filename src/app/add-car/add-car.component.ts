import { Component} from '@angular/core';
import { CrudService } from '../services/crud.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent {
  car: any;
  carName: string;
  carPrice: string;
  carRented: string;
  selectedOption: string;
  printedOption: string;
  selectedOptionReturn: string;
  printedOptionReturn: string;
  Record = {};
  usid : string;
  carReturnDate : number;
  diffDays: number;
  carToPay : number;

  constructor(public crudservice : CrudService, public firebaseAuth : AngularFireAuth){
    this.firebaseAuth.user.subscribe((data => {
      this.usid = data.uid;
    }))
  }

  ngOnInit(){
    this.crudservice.getCar().subscribe(data=>{
      this.car = data.map(e =>{
        return{
          id:e.payload.doc.id,
          carName:e.payload.doc.data()['carName'],
          carPrice:e.payload.doc.data()['carPrice'],
          carRented:e.payload.doc.data()['carRented'],
        };
      })
      console.log(this.car);
    })
  }

  CreateRecord(){
    this.Record['carName'] = this.carName;
    this.Record['carPrice'] = this.carPrice;
    this.Record['carRented'] = '0';
    this.crudservice.addCar(this.Record).then(res =>{
      this.carName = "";
      this.carPrice = "";
      this.carRented = "";
      console.log(res);
    }).catch(error => {
      console.log(error);
    })
  }

  rentCar(){
    this.printedOption = this.selectedOption;
    console.log(this.printedOption);
    this.crudservice.updateRentCar(this.printedOption);
  }

  returnCar(){
    this.printedOptionReturn = this.selectedOptionReturn;
    this.crudservice.returnRentCar(this.printedOptionReturn).subscribe(data =>{
      this.carReturnDate = data.payload.data()['dateRent'];
      var rate = data.payload.data()['carPrice'];
      var diff = Math.abs(Date.now() - this.carReturnDate);
      this.diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      this.carToPay = rate*this.diffDays;
      console.log(this.diffDays);
      this.myFunc();
    })
  }
  myFunc() {
    alert("To Pay: "+this.carToPay);
  }
}
