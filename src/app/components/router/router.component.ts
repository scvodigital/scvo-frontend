import { Component, Directive, ElementRef, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title, DOCUMENT } from '@angular/platform-browser';
import { Location } from '@angular/common';

import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.css']
})
export class RouterComponent implements OnInit {
  constructor(private router: RouterService) { }

  ngOnInit() {
  }
}
