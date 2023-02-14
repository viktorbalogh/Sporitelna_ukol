import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm  } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'form-component-form',
  templateUrl: './form.component-form.html',
  styleUrls: ['./form.component-form.css']
})
 export class FormComponent implements OnInit{
  title = 'FormApp_project';
  reactiveForm : FormGroup; 

  constructor() {
  this.ngOnInit();
  }
  ngOnInit() {  
    //validators
    this.reactiveForm = new FormGroup({
      company: new FormControl(null, [Validators.required, Validators.maxLength(40)]),
      id: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{8}')]),
      address: new FormControl(null, [Validators.required, Validators.maxLength(40)]),
      zip: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{5}')]),
      city: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      firstname: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
      familyname: new FormControl(null, [Validators.required, Validators.maxLength(40)]),
      email: new FormControl(null, [Validators.required, Validators.email])
    });
    //local storage save data
    if (localStorage.getItem('formdata')) {
      this.reactiveForm.setValue(JSON.parse(localStorage.getItem('formdata'))); 
    } else {
      this.reactiveForm.valueChanges.subscribe(x => {localStorage.setItem("formdata", JSON.stringify(this.reactiveForm.value))});
    }
  }

  submit(){
    localStorage.setItem("formdata", JSON.stringify(this.reactiveForm.value))
    var html = <HTMLInputElement>document.getElementById("container");
    html.classList.add("d-none");
    this.fillConfirmationHTML(this.reactiveForm.get("company").value, 
                              this.reactiveForm.get("id").value, 
                              this.reactiveForm.get("address").value + ", " + this.reactiveForm.get("city").value + ", " + this.reactiveForm.get("zip").value,
                              this.reactiveForm.get("firstname").value + " " + this.reactiveForm.get("familyname").value,
                              this.reactiveForm.get("email").value);
    this.saveToDB(this.reactiveForm.get("company").value, 
                  Number(this.reactiveForm.get("id").value), 
                  this.reactiveForm.get("address").value, 
                  this.reactiveForm.get("city").value,
                  Number(this.reactiveForm.get("zip").value),
                  this.reactiveForm.get("firstname").value,
                  this.reactiveForm.get("familyname").value,
                  this.reactiveForm.get("email").value)
   localStorage.clear();
  }

  fillConfirmationHTML(company:string, id: number, fullAddress: string, fullName: string, email: string){
    var html = <HTMLInputElement>document.getElementById("confirmation");
    var text = `<h1 style="text-align : center; margin-bottom : 30px">Potvrzení smlouvy pro společnost ` + company + `</h1><br>
    <h3>` + company + `</h3><br>
    <h3>IČO: ` + id + `</h3><br>
    <h3>sídlem: ` + fullAddress + `</h3><br>
    <div style="text-align : center; margin-top : 150px; margin-bottom : 100px"><h3>Společnost souhlasí s poskytnutím údajů pro interní zpracování.</h3></div><br>
    <h3>Za společnost jednatel:<a style="float : right">email: ` + email + `</a></h3><br>
    <h3>` + fullName + `</h3>`;
    html.value = text;
    html.innerHTML = text;
  }

  saveToDB(company: string, id: number, address: string, city: string, zip: number, firstname: string, familyname: string, email: string){
    console.log(company, id, address, city, zip, firstname, familyname, email);
    /*
    //example of connection to webDB for version 3.0 -- interface form SQLite supported by Chrome, Safari, Opera
    var db = window.datopenDatabase('mydb', '1.0', 'Database', 2 * 1024 * 1024);
    //open transaction and fill with data
    db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS myForm (company, id, address, city, zip, firstname, familyname, email)');
      tx.executeSql('INSERT INTO myForm (company, id, address, city, zip, firstname, familyname, email) VALUES (company, id, address, city, zip, firstname, familyname, email)')
    })
    */
  }
}
