import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../services/user.service'
import { Artist } from '../../models/artist';
import { GLOBAL } from '../../services/global';
import { Route } from '@angular/compiler/src/core';
import { ThrowStmt } from '@angular/compiler';
import { ArtistService } from 'src/app/services/artist.service';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css'],
  providers: [UserService]
})
export class ArtistListComponent implements OnInit {
  public titulo:string;
  public artists:Artist;
  public identity;
  public token;
  public url:string;
  public next_page;
  public prev_page;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _userService:UserService,
    private _artistService:ArtistService
  ) {
    this.titulo = 'Artista';
    this.identity = this._userService.getIdentity
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.next_page = 1;
    this.prev_page = 1;

  }

  ngOnInit() {
    this.getArtists();
  }

  getArtists(){
    this._route.params.subscribe(params => {
      let page = +params['page'];
      if(!page){
        page = 1;
      }else{
        this.next_page = page+1;
        this.prev_page = page-1;

        if(this.prev_page == 0){
          this.prev_page = 1;
        }
      }

      this._artistService.getArtists(this.token, page).subscribe(
        response => {
          if(!response.artists){
            this._router.navigate(['/']);
          }else{
            this.artists = response.artists;
            console.log(this.artists);
          }
        },
        error => {
          console.log(<any>error);
          this._router.navigate(['/']);
        }
      );

    });
  }

  public confirmado;
  onDeleteConfirm(id){
    this.confirmado = id;
  }

  onCancelArtist(){
    this.confirmado == null;
  }

  onDeleteArtist(id){
    this._artistService.deleteArtist(this.token, id).subscribe(
      response => {
        /*if(!response.artists){
          this._router.navigate(['/']);
        }else{*/
          this.getArtists();
        //}
      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/']);
      }
    );
  }

}
