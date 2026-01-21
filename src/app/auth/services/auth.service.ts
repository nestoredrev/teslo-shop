import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import type { User } from '../interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../interfaces/authResponse.interface';

const baseUrl = environment.baseUrl;

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';  

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  checkStatusResource = rxResource({
    stream: () => this.checkAuthStatus(),
  })


  public readonly _authStatus = signal<AuthStatus>('checking');
  private readonly _user = signal<User|null>(null);
  private readonly _token = signal<string|null>( localStorage.getItem('token') );

  authStatus = computed<AuthStatus>(() => {
    if( this._authStatus() === 'checking' ) return 'checking';
    if( this._user() ) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed<User|null>( () => this._user() );
  token = computed<string|null>( () => this._token() );


  login( email: string, password: string ):Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email: email,
      password: password
    }).pipe(
      map( resp => {
        return this.handleAuthSuccess(resp);
      }),
      catchError( (error:any) => {
        return this.handleAuthError(error);
      })
    )
  }

  register( email: string, password: string, fullName: string ):Observable<boolean|unknown> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, {
      email: email,
      password: password,
      fullName: fullName
    }).pipe(
      map( resp => {
        return true;
      }),
      catchError( (error:any) => {
        return throwError(() => error.error.message);
      })
    )
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if( !token ) {
      this._authStatus.set('not-authenticated');
      return of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`,{
      // headers:{
      //   'Authorization': `Bearer ${ token }`
      // }
    }).pipe(
      map( resp => this.handleAuthSuccess(resp) ),
      catchError( (error:any) => this.handleAuthError(error) )
    );
  }

  private handleAuthSuccess( resp: AuthResponse ) {
    this._authStatus.set('authenticated');
    this._user.set(resp.user);
    this._token.set(resp.token);
    localStorage.setItem('token', resp.token);
    return true;
  }

  private handleAuthError(err: any){
    this.logout();
    return of(false);
  }

  logout(){
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
  }


}
