import { Component, OnInit } from '@angular/core';
import { Artist } from 'src/app/models/artist';
import { Album } from 'src/app/models/album';
import { Song } from 'src/app/models/song';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ArtistService } from 'src/app/services/artist.service';
import { AlbumService } from 'src/app/services/album.service';
import { GLOBAL } from 'src/app/services/global';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {

  public titulo:string;
  public artist:Artist;
  public album:Album;
  public songs:Song[];
  public identity;
  public token;
  public url:string;
  public alertMessage;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _userService:UserService,
    private _artistService:ArtistService,
    private _albumService:AlbumService,
    private _songService:SongService
  ) {
    this.identity = this._userService.getIdentity
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

  }

  ngOnInit() {
    this.getAlbum();
  }

  getAlbum(){
    this._route.params.subscribe(params => {
      let id = params['id'];

      this._albumService.getAlbum(this.token,id).subscribe(
        response => {
          if(!response.album){
            this._router.navigate(['/']);
          }else{
            this.album = response.album;

            //Sacar las canciones
            this._songService.getSongs(this.token, response.album._id).subscribe(
              res => {
                if(!res.songs){
                  this.alertMessage = 'Error en el servidor';
                }else{
                  this.alertMessage = 'El album se agrego correctamente';
                  this.songs = res.songs;

                }
              },
              error => {
                var errorMessage = <any>error;

                if(errorMessage != null){
                  var body = JSON.parse(error.body)
                  this.alertMessage = body.message;
                  console.log(error);
                }
              });
          }
        },
        error => {
          console.log(<any>error);
          this._router.navigate(['/']);
        }
      );
    });
  }

  onSubmit(){

  }

  onDeleteSong(id){
    this._songService.deleteSong(this.token, id).subscribe(
      response => {
        /*if(!response.song){
          this._router.navigate(['/']);
        }else{*/
          this.getAlbum();
        //}
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null){
          var body = JSON.parse(error.body)
          this.alertMessage = body.message;
          console.log(error);
        }
      });
  }

  startPlayer(song){
    let song_player = JSON.stringify(song);
    let file_path = this.url + 'get-file-song/' + song.file;
    let img_path = this.url + 'assets/img/album.png' + song.album.img;

    localStorage.setItem('sound_song', song_player);

    document.getElementById("mp3-source").setAttribute("src", file_path);
    (document.getElementById("player") as any ).load();
    (document.getElementById("player") as any ).play();

    document.getElementById('play-song-title').innerHTML = song.name;
    document.getElementById('play-song-artist').innerHTML = song.album;
    document.getElementById('play-song-album').setAttribute('src', img_path);
  }

}
