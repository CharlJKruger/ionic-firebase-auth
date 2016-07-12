// Ionic Starter App

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyB-hLgwcL7b4htI0dVedahAiN3ljBktF5c',
  authDomain: 'ionic-firebase-auth-6c755.firebaseapp.com',
  databaseURL: 'https://ionic-firebase-auth-6c755.firebaseio.com',
  storageBucket: ''
};
firebase.initializeApp(config);

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app.services' is found in services.js
// 'app.controllers' is found in controllers.js
angular.module('app', [
    'ionic',
    'firebase',
    'app.routes',
    'app.controllers',
    'app.services'
  ])

  .run(function ($ionicPlatform, $rootScope, $state) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireSignIn promise is rejected
      // and redirect the user back to the home page
      if (error === 'AUTH_REQUIRED') {
        $state.go('signIn');
      }
    });
  });
