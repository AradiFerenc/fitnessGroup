import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  getAll() {
    return this.http.get<User []>('http://localhost:3000/listusers', {withCredentials: true});
  }
}
