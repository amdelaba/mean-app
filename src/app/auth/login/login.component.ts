import { AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{

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

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.auth.login(form.value.email, form.value.password);  
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
