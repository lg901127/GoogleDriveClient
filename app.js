var CLIENT_ID = '329290453260-nkl4lfkduqkh8nfgvm5lr64cffo40o7n.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata'];

var filePicker = angular.module('filePicker', []);
filePicker.controller('mainController', function($scope){
  $scope.files = [];
  function checkAuth() {
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
      }, handleAuthResult);
    }

  $scope.handleAuthClick = function(event) {
    // console.log("handleAuthClick");
    gapi.auth.authorize(
      {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
      handleAuthResult
    );
    return false;
  }

  function handleAuthResult(authResult) {
    // console.log("handleAuthResult");
    if (authResult && !authResult.error) {
      loadDriveApi();
    }
  }

  function loadDriveApi() {
    // console.log("loadDriveApi")
    gapi.client.load('drive', 'v3', listFiles);
  }

  function listFiles() {
    var request = gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files"
    });

    request.execute(function(resp) {
      var files = resp.files;
      // console.log(files[0]);
      for (var i in files) {
        $scope.$apply(function() {
          $scope.files.push(files[i]);
        });
      }
      $scope.nextPageToken = resp.nextPageToken;
      // console.log(files);
      // console.log($scope.files);
    });
  }
  $scope.nextPage = function(nextPageToken){
    var request = gapi.client.drive.files.list({
      'pageSize': 10,
      'pageToken': nextPageToken,
      'fields': "nextPageToken, files"
    });
    request.execute(function(resp) {
      $scope.nextPageToken = resp.nextPageToken;
      var files = resp.files;
      for (var i in files) {
        $scope.$apply(function() {
          $scope.files.push(files[i]);
        });
      };
    });
  }

  $scope.deleteFile = function(id, index) {
    var request = gapi.client.drive.files.delete({
      'fileId': id
    });
    request.execute();
    $scope.files.splice(index, 1);
  }

  $scope.u = function() {
    var file = document.getElementById("myFile").files;
    var uploader = new MediaUploader({
      file: file[0],
      token: gapi.auth.getToken().access_token,
      onComplete: function() {
        $scope.$apply(function() {
          $scope.uploadMsg = "Succeeded!";
        })
      },
      onError: function() {
        $scope.uploadMsg = "Error!";
      },
      onProgress: function() {
        $scope.$apply(function() {
          $scope.uploadMsg = "Uploading..";
        })
      }
    });
    uploader.upload();
  }

})
