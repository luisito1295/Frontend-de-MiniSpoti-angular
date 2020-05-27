import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Song } from '../../models/song';
import { SongService } from '../../services/song.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'song-edit',
  templateUrl: './song-add.component.html',
  styleUrls: ['./song-add.component.css'],
  providers:[UserService, SongService, UploadService]
})
export class SongEditComponent implements OnInit {

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
    private _songService:SongService,
    private _uploadService:UploadService
  ) {
    this.titulo = 'Añadir nueva cancion';
    this.identity = this._userService.getIdentity
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song(1,'','','','');
    this.is_edit = true;
  }

  ngOnInit(){
    //Sacar la cancion a editar
    this.getSong();
  }

  getSong(){
    this._route.params.forEach((params:Params) => {
      //Obtenermos el ID del artista
      let id = params['id'];

      this._songService.getSong(this.token, id).subscribe(
        res => {
          if(!res.song){
            this.alertMessage = 'Error en el servidor';
            this._router.navigate(['/']);
          }else{
            this.alertMessage = 'La pista se agrego correctamente';
            this.song = res.song;

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

  onSubmit(){
    this._route.params.forEach((params:Params) => {
      //Obtenermos el ID del artista
      let id = params['id'];

      this._songService.editSong(this.token, id, this.song).subscribe(
        res => {
          if(!res.song){
            this.alertMessage = 'Error en el servidor';
          }else{
            this.alertMessage = 'La pista se agrego correctamente';
            //Subir fichero de audio
            if(!this.filesToUpload){
              this._router.navigate(['/album', res.song.album]);
            }else{
              this._uploadService.makeFileRequest(this.url +'upload-file-song/' + id, [], this.filesToUpload, this.token, 'file')
              .then(
                (result:any) => {
                  this._router.navigate(['/album', res.song.album]);
                },
                (error) => {
                  console.log(error.message)
                }
              );
            }

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
				formData.append('file', files[i], files[i].name);
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
