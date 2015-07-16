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
  }

})();