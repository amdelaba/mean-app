import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isUserAuthenticated = false;
  private authListenerSub: Subscription;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.isUserAuthenticated = this.auth.getIsAuth();
    this.authListenerSub = this.auth
      .getAuthStatusAsListener()
      .subscribe(isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.auth.logout();
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

}
