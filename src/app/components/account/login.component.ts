import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http, Headers } from '@angular/http';

import { AppService } from '../../services/app.service';
import { SiteComponent } from '../../common/base.component';

import { AngularFire, FirebaseListObservable, AngularFireAuth, AuthProviders, AuthMethods } from 'angularfire2';

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

	}

	login() {
		var that = this;
		// this.crypto.getHash(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).then(hash => {
		var credentials = {
			email: this.loginForm.controls['email'].value,
			password: this.loginForm.controls['password'].value
		};

		var config = {
			method: AuthMethods.Password,
			provider: AuthProviders.Password
		};

		this.af.auth.login(credentials, config).then(result => {
			that.router.navigate(['/']);
		}).catch(err => {
			console.error(err);
			this.message = err.message;
		});
		// }).catch(err => {
		// 	console.error('Error getting hash', err);
		// });
	}

	SSO(provider){
		provider = AuthProviders[provider];
		var that = this;
		this.appService.af.auth.login({ provider: provider, method: AuthMethods.Popup }).then(response => {
			this.appService.user.email = response.auth.email;
			this.appService.user.name = response.auth.displayName;
			// console.log('Logged in with ', provider, response);
			that.router.navigate(['/']);
		}).catch(err => {
			console.error('Error logging in', provider, err);
			this.message = err.message;
		});
	}
}
