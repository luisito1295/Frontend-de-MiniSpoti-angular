import { Component, OnInit } from '@angular/core';
import { Artist } from 'src/app/models/artist';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from 'src/app/services/global';
import { ArtistService } from 'src/app/services/artist.service';

@Component({
  selector: 'app-artist-add',
  templateUrl: './artist-add.component.html',
  styleUrls: ['./artist-add.component.css'],
  providers: [UserService, ArtistService]
})
export class ArtistAddComponent implements OnInit {

  public titulo:string;
  public artist:Artist;
  public identity;
  public token;
  public url:string;
  public alertMessage;
  public is_edit;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _userService:UserService,
    private _artistService:ArtistService
  ) {
    this.titulo = 'Crear nuevo artista';
    this.identity = this._userService.getIdentity
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('','','','');
    this.is_edit = true;

  }

  ngOnInit() {
  }

  onSubmit(){
    console.log(this.artist);
    this._artistService.addArtist(this.token, this.artist).subscribe(
      res => {

        if(!res.artist){
          //alert('Error al agregar el artista');
          this.alertMessage = 'Error en el servidor';
        }else{
          this.alertMessage = 'El artista se agrego correctamente';
          this.artist = res.artist;
          this._router.navigate(['/editar-artista', res.artist._id]);

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
