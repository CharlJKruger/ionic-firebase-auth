angular.module('app.controllers', [])

  .controller('AppCtrl', function ($scope, $state, Auth, $firebaseObject) {

    $scope.auth = Auth;

    // any time auth state changes, add the user data to scope
    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
      $scope.signedInUser = firebaseUser;

      var ref = firebase.database().ref().child('users');
      $scope.profile = $firebaseObject(ref.child(firebaseUser.uid));

      console.log($scope.signedInUser);

    });

    $scope.logout = function () {
      Auth.$signOut();
      $state.go('signIn');
    };
  })

  .controller('SignInCtrl', function ($scope, Auth, $state, $ionicHistory, $ionicLoading, $window, $firebaseAuth, $ionicPopup) {

    var auth = $firebaseAuth();

    $scope.signIn = function (user) {
      $ionicLoading.show({
        template: 'Signing in'
      });
      $scope.signedInUser = null;
      $scope.error = null;

      auth.$signInWithEmailAndPassword(user.email, user.pass).then(function (firebaseUser) {
        $scope.signedInUser = firebaseUser;
        $ionicLoading.hide();
        $state.go('app.dashboard');
      }).catch(function (error) {
        $scope.error = error;
      });
    };

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

        $ionicPopup.alert({
            title: 'Woops!',
            template: '<p>' + errorMessage + '</p><p><strong class="text-center">' + email + '</strong></p>'
          });

        console.log(errorMessage);
      });
    };
  })

  .controller('CreateUserCtrl', function ($scope, $state, $ionicHistory, Auth) {
    $scope.createUser = function (user) {
      $scope.message = null;
      $scope.error = null;

      // Create a new user
      Auth.$createUserWithEmailAndPassword(user.email, user.pass)
        .then(function (firebaseUser) {
          $scope.message = "User created with uid: " + firebaseUser.uid;

          // Add additional user info
          var fredRef = firebase.database().ref().child('users');
          fredRef.child(firebaseUser.uid).set({
            name: user.name
          });
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.dashboard');
        }).catch(function (error) {
        $scope.error = error;
      })
    };
  })

  .controller('AccountCtrl', function ($scope) {

  })

  .controller('DashCtrl', function ($scope) {

  });
