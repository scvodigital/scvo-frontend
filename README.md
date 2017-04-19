# SCVO Website (public frontend) [![Build Status](https://travis-ci.org/scvodigital/scvo-frontend.svg?branch=dev)](https://travis-ci.org/scvodigital/scvo-frontend)

[![Dependency Status](https://david-dm.org/scvodigital/scvo-frontend/dev.svg)](https://david-dm.org/scvodigital/scvo-frontend/dev) [![devDependency Status](https://david-dm.org/scvodigital/scvo-frontend/dev/dev-status.svg)](https://david-dm.org/scvodigital/scvo-frontend/dev#info=devDependencies)

This is the repository for the new SCVO website project, it contains the codebase for the public website. Development deployment instructions are listed below.

This repository [Wiki](https://github.com/scvodigital/scvo-frontend/wiki) contains project documentation.

## Installation
```
git clone https://github.com/scvodigital/scvo-frontend
cd scvo-frontend
sudo npm i -g typescript firebase-tools @angular/cli
npm i
```

## Run Development Server
```
npm start
```
Navigate to [localhost:2000](http://localhost:2000). The app will automatically reload if you change any of the source files.

## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

Before running the tests make sure you are serving the app via `ng serve` or `npm start`.

## Live Deployment
### CI
There is continuous integration via [Travis](https://travis-ci.org) on `git push` which automatically deploys to [Google Firebase](https://firebase.google.com) CDN hosting.

### Manually
```
npm run deploy
```
This builds minified code and deploys via Firebase.

## Information
The repository [wiki](https://github.com/scvodigital/scvo-frontend/wiki) will contain project documentation.

The website address is [beta.scvo.org](https://beta.scvo.org).

* [Documentation](https://github.com/scvodigital/scvo-frontend/wiki)
* [Bug tracker](https://github.com/scvodigital/scvo-frontend/issues)

## Technical Specs
This is an [Angular](https://angular.io) app using [TypeScript](https://www.typescriptlang.org).

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-rc0.

* Angular2 app - [beta.scvo.org](https://beta.scvo.org)
    * Uses [Sass](http://sass-lang.com) for styles to extend the capabilities of CSS
    * Uses [LiveReload](http://livereload.com) to automatically reload code changes in development
* Elasticsearch search engine
* Drupal CMS - [cms.scvo.org.uk](http://cms.scvo.org)
    * Connects independently to Elasticsearch to index content across all web properties
* Salesforce - [www.salesforce.com](http://www.salesforce.com)
* Indexed via [ElasticForce](https://github.com/scvodigital/elasticforce)
