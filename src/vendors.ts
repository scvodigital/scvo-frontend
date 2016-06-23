// Vendors

// Angular 2
import '@angular/platform-browser-dynamic';
import '@angular/platform-browser';
import '@angular/core';
import '@angular/http';
import '@angular/router';

// Material Design
import "angular2-materialize";

// RxJS 5
// import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

// Elasticsearch
import 'elasticsearch';

// For vendors for example jQuery, Lodash, angular2-jwt import them here
// Also see src/typings.d.ts as you also need to run `typings install x` where `x` is your module

/** Map relative paths to URLs. */
const map: any = {
   "materialize": "vendor/materialize-css",
   "angular2-materialize": "vendor/angular2-materialize",
   "jquery": "vendor/jquery"
};

/** User packages configuration. */
const packages: any = {
  'materialize': {
    "format": "global",
    "main": "dist/js/materialize",
    "defaultExtension": "js"
  },
  'angular2-materialize': {
    "main": "dist/index",
    "defaultExtension": "js"
  }
};
