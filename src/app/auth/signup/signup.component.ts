import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { timer } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading = false;
  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  onSignup(form: NgForm){
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.auth.createUser(form.value.email, form.value.password);
  }

}
