import { Component, OnInit } from '@angular/core';
import { Artist } from 'src/app/models/artist';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from 'src/app/services/global';
import { ArtistService } from 'src/app/services/artist.service';
import { AlbumService } from 'src/app/services/album.service';
import { Album } from 'src/app/models/album';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-album-add',
  templateUrl: './album-add.component.html',
  styleUrls: ['./album-add.component.css'],
  providers: [UserService, AlbumService, ArtistService, UploadService]
})
export class AlbumAddComponent implements OnInit {

  public titulo:string;
  public artist:Artist;
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
    private _artistService:ArtistService,
    private _albumService:AlbumService
  ) {
    this.titulo = 'Crear nuevo album';
    this.identity = this._userService.getIdentity
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('','','',2020,'','');
    this.is_edit = false;
  }

  ngOnInit(){
  }

  onSubmit(){
    this._route.params.forEach((params:Params) => {
      //Obtenermos el ID del artista
      let artistId = params['artist'];
      this.album.artist = artistId;

      this._albumService.addAlbum(this.token, this.album).subscribe(
        res => {
          if(!res.album){
            //alert('Error al agregar el artista');
            this.alertMessage = 'Error en el servidor';
          }else{
            this.alertMessage = 'El album se agrego correctamente';
            this.album = res.album;
            this._router.navigate(['/editar-album', res.album._id]);

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
      console.log(this.album);
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
