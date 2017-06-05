import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../services/app.service';

@Component({
	selector: 'main-container.content',
	templateUrl: './logout.component.html',
})
export class LogoutComponent {
	constructor(private appService: AppService, private router: Router) {
		this.appService.afAuth.auth.signOut();
        this.router.navigate(['/scvo-login']);
	};
}
