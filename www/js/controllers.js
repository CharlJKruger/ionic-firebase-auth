angular.module('app.controllers', [])

  .controller('AppCtrl', function ($scope, $state, Auth, $firebaseObject) {

    $scope.auth = Auth;

    // any time auth state changes, add the user data to scope
    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
      // access Firebase auth user via signedInUser
      $scope.signedInUser = firebaseUser;

      console.log(firebaseUser);

      var ref = firebase.database().ref().child('users');
      // access additional user info in the database via profile
      $scope.profile = $firebaseObject(ref.child(firebaseUser.uid));

    });

    // log the user out
    $scope.logout = function () {
      Auth.$signOut();
      $state.go('signIn');
    };
  })

  .controller('SignInCtrl', function ($scope, Auth, $state, $ionicHistory, $ionicLoading, $window, $firebaseAuth, $ionicPopup) {

    var auth = $firebaseAuth();
    $scope.user = {};

    // auth with email and password
    $scope.signIn = function (form, user) {

      if (form.$valid) {
        $ionicLoading.show({
          template: 'Signing in'
        });
        $scope.signedInUser = null;
        $scope.error = null;

        auth.$signInWithEmailAndPassword(user.email, user.password).then(function (firebaseUser) {
          $scope.signedInUser = firebaseUser;
          $ionicLoading.hide();
          $state.go('app.dashboard');
        }).catch(function (error) {
          $ionicLoading.hide();
          $scope.error = error;

          console.log(error);

          if(error.code === 'auth/user-not-found') {
            $ionicPopup.alert({
              title: 'Woops!',
              template: '<p>Seems like there is no account registered with that email address.</p>'
            });
          }

          if(error.code === 'auth/wrong-password') {
            $ionicPopup.alert({
              title: 'Woops!',
              template: '<p>Seems like you have entered in the wrong password.</p>'
            });
          }

        });
      }
    };

    // auth with social provider
    // just a note, can login with facebok and then google. Auth provider will update though cant do it the other way around (Google being sneaky?)
    $scope.singInSocial = function (getProvider) {
      var provider = null;
      $ionicLoading.show({
        template: 'Signing in'
      });

      if (getProvider === 'facebook') {
        // facebook provides email
        provider = new firebase.auth.FacebookAuthProvider();
      } else if (getProvider === 'google') {
        // google provides email
        provider = new firebase.auth.GoogleAuthProvider();
        // cant get the users email from twitter
      } else if (getProvider === 'twitter') {
        provider = new firebase.auth.TwitterAuthProvider();
      } else if (getProvider === 'github') {
        // https://github.com/settings/applications/new
        // can only get the email address is it has been set to public
        provider = new firebase.auth.GithubAuthProvider();
        //provider.addScope('user:email');
      }

      firebase.auth().signInWithPopup(provider).then(function (result) {
        $scope.signedInUser = result.user;
        $ionicLoading.hide();
        $state.go('app.dashboard');
      }).catch(function (error) {
        $ionicLoading.hide();
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        if(error.code === 'auth/account-exists-with-different-credential') {
          $ionicPopup.alert({
            title: 'Woops!',
            template: '<p>Please use the same Social account you originally signed up with</p>'
          });
        }

        console.log(errorCode);
      });
    };
  })

  .controller('CreateUserCtrl', function ($scope, $state, $ionicHistory, Auth) {
    $scope.createUser = function (form, user) {

      // if the form is not valid, don't create the user
      if (form.$valid) {
        $scope.message = null;
        $scope.error = null;

        // Create a new user
        Auth.$createUserWithEmailAndPassword(user.email, user.password)
          .then(function (firebaseUser) {
            $scope.message = "User created with uid: " + firebaseUser.uid;

            // Add additional user name and settings
            var fredRef = firebase.database().ref().child('users');
            fredRef.child(firebaseUser.uid).set({
              name: user.name,
              setting: false
            });
            // dont show back arrow to create view
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            // go to the dashboard once created and singed in
            $state.go('app.dashboard');
          }).catch(function (error) {
          $scope.error = error;
        })
      }

    };
  })

  .controller('AccountCtrl', function ($scope) {

  })

  .controller('DashCtrl', function ($scope) {

  });
