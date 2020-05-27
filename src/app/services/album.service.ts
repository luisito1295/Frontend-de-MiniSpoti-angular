import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpHeaderResponse } from '@angular/common/http';
import { Observable } from 'rxjs'
import { Album } from '../models/album';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  public url:string;
  public identity;
	public token;

  constructor(private _http:HttpClient) {
    this.url = GLOBAL.url;
  }

  getAlbum(token, id:string):Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    let options = new HttpHeaderResponse({headers: headers});

    return this._http.get(this.url + 'album/'+ id, options);
  }

  getAlbums(token, artisId = null):Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    let options = new HttpHeaderResponse({headers: headers});

    if(artisId == null){
      return this._http.get(this.url + 'albums', options);
    }else{
      return this._http.get(this.url + 'albums/'+ artisId, options);
    }

  }

  addAlbum(token, album: Album): Observable<any>{
    let json = JSON.stringify(album);
    let params = json;
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

    return this._http.post(this.url+'album', params, {headers: headers});
  }

  editarAlbum(token, id:string, album:Album): Observable<any>{
    let json = JSON.stringify(album);
    let params = json;
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});

    return this._http.put(this.url+'album/'+id, params, {headers: headers});
  }

  deleteAlbum(token, id:string){

    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
    return this._http.delete(this.url+'album/'+id, {headers: headers});
    
  }


}
