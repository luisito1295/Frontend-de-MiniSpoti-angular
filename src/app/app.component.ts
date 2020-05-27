import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from './services/user.service'
import { User } from './models/user';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit {

  public title = 'MUSIFY';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public status: string;
  public errorMessage;
  public url:string;


  constructor(
      private _userService:UserService,
      private _route:ActivatedRoute,
      private _router:Router
    ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    //console.log(this.identity);
    //console.log(this.token);
    this.url = GLOBAL.url;
  }

  onSubmit(){
    // Loguear al usuario y conseguir el objeto y los datos
		this._userService.signup(this.user).subscribe(
			response => {
        let identity = response.user;
        this.identity = identity;

        if(!this.identity || !this.identity._id){
          alert('EL usuario no se ha logeado correctamente');
        }else{
          //Crear elemento en el localstorage para tener al usuario en sesion
          localStorage.setItem('identity', JSON.stringify(identity));

          //Conseguir el token para enviarselo a cada peticion HTTP
          this._userService.signup(this.user, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;

              if(this.token.length <= 0){
                alert('EL usuario no se ha generado correctamente');
              }else{
                //Crear elemento para tener el token disponible
                localStorage.setItem('token', this.token);
                this.user = new User('','','','','','ROLE_USER','');

              }

              //console.log(response);
            },
            error => {
              var errorMessage = <any>error;

              if(errorMessage != null){
                var body = JSON.parse(error._body)
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );
        }

        console.log(response);
			},
			error => {
        var errorMessage = <any>error;

				if(errorMessage != null){
          var body = JSON.parse(error.body)
          this.errorMessage = body.message;
          console.log(error);
        }
			}
		);
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);
  }

  public alertRegister;
  onSubmitRegister(){
    this._userService.register(this.user_register).subscribe(
      res => {
        let user = res.user;
        if(!user._id){
          this.alertRegister = 'Error en el registro';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente '+this.user_register.email;
          this.user_register = new User('','','','','','ROLE_USER','');
        }
      },
      error => {
        var errorMessage = <any>error;

				if(errorMessage != null){
          var body = JSON.parse(error.body)
          this.alertRegister = body.message;
          console.log(error);
        }
      }
    );
    console.log(this.user_register)
  }

}

