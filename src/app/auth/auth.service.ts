import { Router } from '@angular/router';
import { AuthData } from './signup/auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient,
    private router: Router) { }

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusAsListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post('http://localhost:3000/api/users/signup', authData)
      .subscribe( response => {
        console.log(response);
        // this.router.navigate(['/']);
      });
  }

  login(email: string, password: string){
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{token:string, expiresIn: number, userId: string}>(
        'http://localhost:3000/api/users/login', 
        authData
      )
      .subscribe( response => {
        if (response.token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.token = response.token;
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(this.token, expirationDate, this.userId);

          this.router.navigate(['/']);
        }
      });
  }

  autoAuthuser() {
    const authInformation = this.getAuthData();

    if(!authInformation){
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() -  now.getTime();

    console.log(authInformation, expiresIn);

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.userId = authInformation.userId;
      this.authStatusListener.next(true);  
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }


  private setAuthTimer(duration: number) {
    console.log('Setting timer:' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate || !userId){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }



}
