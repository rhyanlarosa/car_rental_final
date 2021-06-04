import { Component} from '@angular/core';
import { CrudService } from '../services/crud.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent {
  Review = {};
  Record = {};
  car: any;
  carName: string;
  carPrice: string;
  carRented: string;
  selectedOption: string;
  printedOption: string;
  selectedOptionReturn: string;
  printedOptionReturn: string;
  usid : string;
  carReturnDate : number;
  diffDays: number;
  carToPay : number;
  userReview:string;
  sentiment : any;
  userReviewNumber : number;
  carRate : number;
  toPay : any;

  constructor(public crudservice : CrudService, public firebaseAuth : AngularFireAuth, private httpClient : HttpClient){
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

  async analyzer() {
    let sentimentJSON: any;
    sentimentJSON = await this.httpClient.get('http://127.0.0.1:5002/sentiment-analysis/' + this.userReview).toPromise() as JSON
    this.sentiment = sentimentJSON["sentiment"]

    if (this.sentiment == "Positive") {
      this.userReviewNumber = 1;
    }
    else if (this.sentiment == "Negative") {
      this.userReviewNumber = -1;
    }
    else {
      this.sentiment = "Neutral"
      this.userReviewNumber = 0;
    }
    this.CreateReview()
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
      this.carRate = data.payload.data()['carPrice'];
      this.analyzer();
      // this.CreateReview();
    })
  }

  Calculate(){
    var diff = Math.abs(Date.now() - this.carReturnDate);
    this.diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    this.carToPay = this.carRate*this.diffDays;
    console.log(this.diffDays);
    this.updateCar();
    // this.updateCar();
  }

  CreateReview(){
    this.Review['review'] = this.userReviewNumber;
    this.crudservice.addReviews(this.printedOptionReturn, this.Review).then(res =>{
      console.log(res);
    }).catch(error => {
      console.log(error);
    })
  }

  updateCar(){
    this.crudservice.updateReturnCar(this.printedOptionReturn);
    this.myFunc();
  }

  myFunc() {
    alert("To Pay: "+this.carToPay);
  }
}
