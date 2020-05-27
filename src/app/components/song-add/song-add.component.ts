import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Song } from '../../models/song';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-song-add',
  templateUrl: './song-add.component.html',
  styleUrls: ['./song-add.component.css']
})
export class SongAddComponent implements OnInit {

  public titulo:string;
  public song:Song;
  public identity;
  public token;
  public url:string;
  public alertMessage;
  public is_edit;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _userService:UserService,
    private _songService:SongService
  ) {
    this.titulo = 'Añadir nueva cancion';
    this.identity = this._userService.getIdentity
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song(1,'','','','');
    this.is_edit = false;
  }

  ngOnInit(){

  }

  onSubmit(){
    console.log(this.song);
    this._route.params.forEach((params:Params) => {
      //Obtenermos el ID del artista
      let albumId = params['album'];
      this.song.album = albumId;

      this._songService.addSong(this.token, this.song).subscribe(
        res => {
          if(!res.song){
            //alert('Error al agregar el artista');
            this.alertMessage = 'Error en el servidor';
          }else{
            this.alertMessage = 'La  se agrego correctamente';
            this.song = res.song;
            this._router.navigate(['/editar-tema', res.song._id]);
            
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
    });

  }

  public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

  makeFileRequest(url:string, params: Array<string>, files: Array<File>){
    var token = this.token;

    return new Promise(function(resolve, reject){
			var formData: any = new FormData();
			var xhr = new XMLHttpRequest();

			for(var i = 0; i < files.length; i++){
				formData.append('img', files[i], files[i].name);
			}

			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						resolve(JSON.parse(xhr.response));
					}else{
						reject(xhr.response);
					}
				}
			}

			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', token);
			xhr.send(formData);

		});
  }

}
