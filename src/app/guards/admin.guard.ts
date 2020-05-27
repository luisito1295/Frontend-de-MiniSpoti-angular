import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
		private _router: Router,
		private _userService: UserService
	){}

	canActivate(){
		let identity = this._userService.getIdentity();

		if(identity && identity.role == 'ROLE_ADMIN'){
			return true;
		}else{
			this._router.navigate(['/']);
			return false;
		}
	}

}
