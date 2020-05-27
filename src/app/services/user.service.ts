import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'
import {map} from 'rxjs/operators';
import { User } from '../models/user';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url:string;
  public identity;
	public token;

  constructor(private _http:HttpClient) {
    this.url = GLOBAL.url;
  }

  register(user: User): Observable<any>{
    let json = JSON.stringify(user);
    let params = json;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url+'register', params, {headers: headers});
  }

  signup(user_to_login, gettoken = null):Observable<any>{
    if(gettoken != null){
			user_to_login.gettoken = gettoken;
		}
    let json = JSON.stringify(user_to_login);
    let params = json;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url+'login', params, {headers: headers});
  }

  getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity'));

		if(identity != "undefined"){
			this.identity = identity;
		}else{
			this.identity = null;
		}

		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem('token');

		if(token != "undefined"){
			this.token = token;
		}else{
			this.token = null;
		}

		return this.token;
  }

  updateUser(user_to_update):Observable<any>{
    let json = JSON.stringify(user_to_update);
    let params = json;
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.getToken()});

    return this._http.put(this.url+'update-user/'+user_to_update._id, params, {headers: headers});
  }
}
