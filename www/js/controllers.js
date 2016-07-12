angular.module('app.controllers', [])

  .controller('AppCtrl', function ($scope, $state, Auth, $firebaseObject) {

    $scope.auth = Auth;

    // any time auth state changes, add the user data to scope
    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
      $scope.signedInUser = firebaseUser;

      if(typeof firebaseUser != 'undefined') {
        return;
      }

      var ref = firebase.database().ref().child('users');
      $scope.profile = $firebaseObject(ref.child(firebaseUser.uid));

      console.log($scope.signedInUser);

    });

    $scope.logout = function () {
      Auth.$signOut();
      $state.go('signIn');
    };
  })

  .controller('SignInCtrl', function ($scope, Auth, $state, $ionicHistory, $ionicLoading, $window, $firebaseAuth) {
    
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

      if (getProvider === 'facebook') {
        provider = new firebase.auth.FacebookAuthProvider();
      } else if (getProvider === 'google') {
        provider = new firebase.auth.GoogleAuthProvider();
      }

      firebase.auth().signInWithPopup(provider).then(function (result) {
        $scope.signedInUser = result.user;
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
    };
  })

  .controller('CreateUserCtrl', function ($scope) {
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
            name: user.name,
            mobile: user.mobile
          });
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.dash');
        }).catch(function (error) {
        $scope.error = error;
      })
    };
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  })

  .controller('DashCtrl', function ($scope) {

  });
