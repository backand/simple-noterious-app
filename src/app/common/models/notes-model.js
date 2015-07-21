(function () {
  'use strict';

  angular.module('noterious.common')
    .service('NotesModel', ['$http', 'Backand', 'extractData', NotesModel]);

  function NotesModel ($http, Backand, extractData) {
    var self = this;

    function getUrl() {
      return Backand.getApiUrl() + '/1/objects/notes';
    }

    function getUrlForId(noteId) {
      return Backand.getApiUrl() + '/1/objects/notes/' + noteId;
    }

    self.all = function () {
      return $http.get(getUrl()).then(extractData);
    };

    self.fetch = function (noteId) {
      return $http.get(getUrlForId(noteId)).then(extractData);
    };

    self.create = function (note) {
      return $http.post(getUrl(), note).then(extractData);
    };

    self.update = function (noteId, note) {
      return $http.put(getUrlForId(noteId), note).then(extractData);
    };

    self.destroy = function (noteId) {
      return $http.delete(getUrlForId(noteId)).then(extractData);
    };

    //Send file content in base64 to Backand on-demand action
    self.s3FileUpload = function(filename, filedata, success, error)
    {
      return $http ({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/objects/action/notes?name=upload2s3',
        headers: {
          'Content-Type': 'application/json'
        },
        data:
        {
          "filename":filename,
          "filedata": filedata.substr(filedata.indexOf(',')+1, filedata.length) //need to remove the file prefix type
        }
      });
    };
  }

})();