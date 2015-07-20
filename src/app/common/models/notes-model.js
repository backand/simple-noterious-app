(function () {
  'use strict';

  angular.module('noterious.common')
    .service('NotesModel', ['$http', 'Backand', 'extractData', NotesModel]);

  function NotesModel ($http, Backand, extractData) {
    var service = this;

    function getUrl() {
      return Backand.getApiUrl() + '/1/objects/notes';
    }

    function getUrlForId(noteId) {
      return Backand.getApiUrl() + '/1/objects/notes/' + noteId;
    }

    service.all = function () {
      return $http.get(getUrl()).then(extractData);
    };

    service.fetch = function (noteId) {
      return $http.get(getUrlForId(noteId)).then(extractData);
    };

    service.create = function (note) {
      return $http.post(getUrl(), note).then(extractData);
    };

    service.update = function (noteId, note) {
      return $http.put(getUrlForId(noteId), note).then(extractData);
    };

    service.destroy = function (noteId) {
      return $http.delete(getUrlForId(noteId)).then(extractData);
    };


    service.s3FileUpload = function(filename, filedata, success, error)
    {
      console.log('update: filedata.length='+filedata.length);
      var req = {
        method: 'POST',
        url: Backand.getApiUrl() + '/1/objects/action/notes?name=upload2s3',
        headers: {
          'Content-Type': 'application/json'
        },
        data:
        {
          "filename":filename,
          "filedata": filedata.replace("data:image/jpeg;base64,", "")
        }
      }

      theHttp(req).success(function(res){
        success(res);
      }).error(function(err){
        error(err);
      });
    };
  }

})();