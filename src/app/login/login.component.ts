import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { User } from './user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ User ]
})
export class LoginComponent implements OnInit {
 user = new User();
 constructor(private loginService: LoginService, private router: Router) {
 }

 ngOnInit() {
 }
 login() {
   this.loginService.authenticate(this.user.username, this.user.password).subscribe(
     data => {
       if (data['authenticated']) {
         localStorage.setItem('currentUser', data['user']);
           if (data['user'] === 'guest') {
              this.router.navigate( ['/home'] );
            } else {
               this.router.navigate( ['/maps'] );
            }
         } else {
          // Alert the user of incorrect credentials
         }
       },
     err => { console.log(err); }
   );
  }
}
