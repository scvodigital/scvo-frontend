import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http, Headers } from '@angular/http';

import { AppService } from '../../services/app.service';
import { SiteComponent } from '../../common/base.component';

@Component({
	selector: 'main-container.content',
	templateUrl: './login.component.html'
})
export class LoginComponent extends SiteComponent {
	loginForm: FormGroup;
	message: string;

	constructor(appService: AppService, private router: Router, private http: Http, private formBuilder: FormBuilder) {
		super(appService);
		this.loginForm = this.formBuilder.group({
			'email': ['', Validators.required],
			'password': ['', Validators.required]
		});
	};

	onSiteLoaded(){
        if (this.appService.user && this.appService.user.roles && this.appService.user.roles.indexOf('Administrator') > -1) {
            this.router.navigate(['/admin']);
        }
	}

	login() {
		var that = this;
		// this.crypto.getHash(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).then(hash => {
		var credentials = {
			email: this.loginForm.controls['email'].value,
			password: this.loginForm.controls['password'].value
		};

		// var config = {
		// 	method: AuthMethods.Password,
		// 	provider: AuthProviders.Password
		// };


        this.appService.afAuth.auth.signInWithEmailAndPassword(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).then(result => {
			that.router.navigate(['/admin']);
		}).catch(err => {
			console.error(err);
			this.message = err.message;
		});
		// }).catch(err => {
		// 	console.error('Error getting hash', err);
		// });
	}
}
