import { Component, OnInit } from '@angular/core';
import { Artist } from 'src/app/models/artist';
import { Album } from 'src/app/models/album';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ArtistService } from 'src/app/services/artist.service';
import { AlbumService } from 'src/app/services/album.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.css'],
  providers: [UserService, ArtistService, AlbumService]
})
export class ArtistDetailComponent implements OnInit {

  public titulo:string;
  public artist:Artist;
  public albums:Album[];
  public identity;
  public token;
  public url:string;
  public alertMessage;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _userService:UserService,
    private _artistService:ArtistService,
    private _albumService:AlbumService
  ) {
    this.identity = this._userService.getIdentity
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

  }

  ngOnInit() {
    this.getArtist();
    this.getAlbums();
  }

  getArtist(){
    this._route.params.subscribe(params => {
      let id = params['id'];

      this._artistService.getArtist(this.token,id).subscribe(
        response => {
          if(!response.artist){
            this._router.navigate(['/']);
          }else{
            this.artist = response.artist;

            //Sacar los albums de los artistas
            this._albumService.getAlbums(this.token, response.artist._id).subscribe(
              res => {
                if(!res.albums){
                  this.alertMessage = 'No hay albums';
                }else{
                  this.albums = res.albums
                  console.log(this.albums);
                }

              },
              error => {
                console.log(<any>error);
                this._router.navigate(['/']);
              }
            );
          }
        },
        error => {
          console.log(<any>error);
          this._router.navigate(['/']);
        }
      );
    });
  }

  getAlbums(){
    //Sacar los albums de los artistas
    this._albumService.getAlbums(this.token).subscribe(
      res => {
        if(!res.albums){
          this.alertMessage = 'No hay albums';
        }else{
          this.albums = res.albums
          console.log(this.albums);
        }

      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/']);
      }
    );
  }

  onDeleteAlbum(id){
    this._albumService.deleteAlbum(this.token, id).subscribe(
      response => {
        /*if(!response.artists){
          this._router.navigate(['/']);
        }else{*/
          this.getAlbums();
        //}
      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/']);
      }
    );
  }

  onSubmit(){

  }

}
