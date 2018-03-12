# SCVO web frontend stack

This project uses [SCVO router](https://github.com/scvodigital/scvo-router) to serve numerous sites.

You'll need Typescript and Firebase Tools installed globally.

## Development server

Run `grunt upgrade-router` to make sure you have the latest router installed.

Run `npm run dev` for a dev server. Navigate to `http://localhost:9000/`.

Run `npm run build` to rebuild local templates and SCSS.

## Deploy

Run `grunt deploy-all` to build and deploy the project to Firebase hosting.