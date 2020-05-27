import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpHeaderResponse } from '@angular/common/http';
import { Observable } from 'rxjs'
import { Artist } from '../models/artist';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  public url:string;
  public identity;
	public token;

  constructor(private _http:HttpClient) {
    this.url = GLOBAL.url;
  }

  getArtist(token, id:string):Observable<any>{
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      });

    let options = new HttpHeaderResponse({headers: headers});

    return this._http.get(this.url + 'artist/'+ id, options);
  }

  getArtists(token, page):Observable<any>{
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      });

    let options = new HttpHeaderResponse({headers: headers});

    return this._http.get(this.url + 'artists/'+ page, options);
  }

  addArtist(token, artist: Artist): Observable<any>{
    let json = JSON.stringify(artist);
    let params = json;
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

    return this._http.post(this.url+'artist', params, {headers: headers});
  }

  updatedArtist(token, id:string, artist:Artist): Observable<any>{
    let json = JSON.stringify(artist);
    let params = json;
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

    return this._http.put(this.url+'artist/'+id, params, {headers: headers});
  }

  deleteArtist(token, id:string){
    /*let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    let options = new HttpHeaderResponse({headers: headers});

    this._http.delete(this.url + 'artist/'+ id, options);*/
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
		return this._http.delete(this.url+'artist/'+id, {headers: headers});
  }

}
