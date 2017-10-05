// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDIUNnyGeZY3sO8gGIf-_2dgO49xKij5zI",
    authDomain: "scvo-net.firebaseapp.com",
    databaseURL: "https://scvo-net.firebaseio.com",
    projectId: "scvo-net",
    storageBucket: "scvo-net.appspot.com",
    messagingSenderId: "782194712584"
  }
};
