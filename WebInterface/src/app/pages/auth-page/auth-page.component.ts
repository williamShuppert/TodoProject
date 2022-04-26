import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {

  @ViewChild('username') usernameElement!: ElementRef;
  @ViewChild('password') passwordElement!: ElementRef;
  @ViewChild('confirmPassword') confirmPasswordElement!: ElementRef;

  showLogin: boolean = true;
  showLoginError: boolean = false;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    
  }

  ngOnInit(): void {
    if (this.authService.isAuthed()) {
      this.router.navigateByUrl("/home");
      return;
    }

    this.showLogin = this.route.snapshot.url[0].path.toLowerCase() == "login";
  }

  submit() {
    if (this.showLogin)
      this.authService.login(
        this.usernameElement.nativeElement.value,
        this.passwordElement.nativeElement.value
      ).then(success => {
        this.errorMessage = 'incorrect credentials';
        this.showLoginError = !success;
      });
    else {
      if (this.confirmPasswordElement.nativeElement.value != this.passwordElement.nativeElement.value) {
        this.errorMessage = "passwords don't match";
        this.showLoginError = true;
      } else if (this.confirmPasswordElement.nativeElement.value.length < 3 || 
          this.passwordElement.nativeElement.value.length < 6) {
        this.errorMessage = "password must be at least 6 characters";
        this.showLoginError = true;
      } else {
        this.authService.registerUser(
          this.usernameElement.nativeElement.value,
          this.passwordElement.nativeElement.value
        );
      }
      
    }
  }

}
