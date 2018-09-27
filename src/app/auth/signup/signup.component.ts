import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.auth.getAuthStatusAsListener().subscribe(
      authStatus =>{
        this.isLoading = false;
      }
    )
  }

  onSignup(form: NgForm){
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.auth.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
  
}
