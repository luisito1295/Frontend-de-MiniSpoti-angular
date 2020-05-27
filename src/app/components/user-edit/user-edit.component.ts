import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service'
import { UploadService } from '../../services/upload.service'
import { User } from '../../models/user';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService, UploadService]
})
export class UserEditComponent implements OnInit {

  public title:string
  public user:User;
  public identity;
  public token;
  public alertUpdate;
	public url: string;

  constructor(private _userService:UserService, private _uploadService: UploadService) {
    this.title = 'Actualizar mis datos';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = GLOBAL.url;
  }

  ngOnInit() {

  }

  onSubmit(){
    //console.log(this.user);
    this._userService.updateUser(this.user).subscribe(
      res => {
        if(!res.user){
          this.alertUpdate = 'El usuario no se ha actualizado';
        }else{
          //this.user = res.user;
          localStorage.setItem('identity', JSON.stringify(this.user));
          document.getElementById('identity_name').innerHTML = this.user.name;
          this.alertUpdate = 'El usuario se ha actualizado correctamente';

          if(!this.filesToUpload){
            //Redireccion
          }else{
            this.makeFileRequest(this.url+'/upload-image-user/'+this.user._id, [], this.filesToUpload)
            .then((result: any) => {
              this.user.img = result.img;
              localStorage.setItem('identity', JSON.stringify(this.user));

              //Actualizar la imagen de la barra o menu lateral
              let image_path = this.url+'get-image-user/'+this.user.img;
              document.getElementById('img-logged').setAttribute('src', image_path);
             });

          }

        }
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null){
          var body = JSON.parse(error._body)
          this.alertUpdate = body.message;
          console.log(error);
        }
      }
    )
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
