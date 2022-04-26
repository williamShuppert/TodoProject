import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  isAuthed(): boolean {
    var jwt = this.getAuthJWT();
    return jwt != null;
  }

  getAuthJWT(): string {
    return localStorage.getItem('authJWT')!;
  }

  setAuthJWT(token: string, username: string) {
    localStorage.setItem('authJWT', token);
    localStorage.setItem('username', username);
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  logout() {
    localStorage.removeItem('authJWT');
    localStorage.removeItem('username');
    this.router.navigateByUrl('/login');
  }

  registerUser(username: string, password: string) {
    return fetch(`${environment.baseApiUrl}/api/Auth/Register`, {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({
        username, password
      })
    }).then(res => {
      if (res.status != 200) return;
      return res.json().then(res => {
        this.setAuthJWT(res.token, username);
        this.router.navigateByUrl('/home');
        return res;
      });
    });
  }

  login(username: string, password: string): Promise<boolean> {
    return fetch(`${environment.baseApiUrl}/api/Auth/Login`, {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({
        username, password
      })
    }).then(async res => {
      if (res.status != 200) return false;
      return res.json().then(res => {
        this.setAuthJWT(res.token, username);
        this.router.navigateByUrl('/home');
        return true;
      });
    });
  }
}
