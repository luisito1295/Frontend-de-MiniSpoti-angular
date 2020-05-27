import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from 'src/app/services/global';
import { AlbumService } from 'src/app/services/album.service';
import { Album } from 'src/app/models/album';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-album-edit',
  templateUrl: './album-add.component.html',
  styleUrls: ['./album-add.component.css'],
  providers: [UserService, AlbumService, UploadService]
})
export class AlbumEditComponent implements OnInit {

  public titulo:string;
  public album:Album;
  public identity;
  public token;
  public url:string;
  public alertMessage;
  public is_edit;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _userService:UserService,
    private _albumService:AlbumService
  ) {
    this.titulo = 'Editar album';
    this.identity = this._userService.getIdentity
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('','','',2020,'','');
    this.is_edit = true;
  }

  ngOnInit(){
    this.getAlbum();
  }

  getAlbum(){
    this._route.params.forEach((params:Params) => {
      //Obtenermos el ID del artista
      let id = params['id'];

      this._albumService.getAlbum(this.token, id).subscribe(
        res => {
          if(!res.album){
            //alert('Error al agregar el artista');
            this.alertMessage = 'Error en el servidor';
            this._router.navigate(['/']);
          }else{
            this.alertMessage = 'El album se agrego correctamente';
            this.album = res.album;
            //this._router.navigate(['/editar-artista', res.artist._id]);

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
      //console.log(this.album);
    });
  }

  onSubmit(){
    this._route.params.forEach((params:Params) => {
      //Obtenermos el ID del artista
      let id = params['id'];

      this._albumService.editarAlbum(this.token, id, this.album).subscribe(
        res => {
          if(!res.album){
            //alert('Error al agregar el artista');
            this.alertMessage = 'Error en el servidor';
          }else{
            this.alertMessage = 'El album se agrego correctamente';

            if(!this.filesToUpload){
              this._router.navigate(['/artista', res.album.artist]);
            }else{
              this.makeFileRequest(this.url+'/upload-image-album/'+id, [], this.filesToUpload)
              .then(
                (result:any) => {
                  this._router.navigate(['/artista', res.album.artist]);
                },
                (error) => {
                  console.log(error)
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
      //console.log(this.album);
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
