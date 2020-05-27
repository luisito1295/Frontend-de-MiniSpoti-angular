import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpHeaderResponse } from '@angular/common/http';
import { Observable } from 'rxjs'
import { Album } from '../models/album';
import { Song } from '../models/song';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  public url:string;
  public identity;
	public token;

  constructor(private _http:HttpClient) {
    this.url = GLOBAL.url;
  }

  getSongs(token, albumId = null):Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    let options = new HttpHeaderResponse({headers: headers});

    if(albumId == null){
      return this._http.get(this.url + 'songs', options);
    }else{
      return this._http.get(this.url + 'songs/'+albumId, options);
    }


  }

  getSong(token, id:string):Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    let options = new HttpHeaderResponse({headers: headers});

    return this._http.get(this.url + 'song/'+ id, options);
  }

  addSong(token, song: Song): Observable<any>{
    let json = JSON.stringify(song);
    let params = json;
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

    return this._http.post(this.url+'song', params, {headers: headers});
  }

  editSong(token, id:string, song:Song): Observable<any>{
    let json = JSON.stringify(song);
    let params = json;
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.getToken()});

    return this._http.put(this.url + 'song/' + id, params, {headers: headers});
  }

  deleteSong(token, id:string):Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    let options = new HttpHeaderResponse({headers: headers});

    return this._http.delete(this.url + 'song/'+ id, options);
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

}
