(function () {
  'use strict';

  angular.module('noterious')
    .directive('note', [NoteDirective]);

  function NoteDirective () {
    return {
      scope: {
        note:'=',
        remove:'&',
        update: '&',
        upload: '&'
      },
      templateUrl: 'app/notes/note.tmpl.html',
      controller: NoteController,
      controllerAs: 'noteCtrl',
      bindToController: true
    }
  }

  function NoteController () {
    var self = this;

    self.loading = false;

    self.updateNote = function () {
      self.loading = true;

      self.update({noteId: self.note.id, note: self.note, isValid: true});
    };

    self.deleteNote = function () {
      self.remove({noteId: self.note.id});
    };

    //get the file content after upload and post it to server side
    self.imageChanged = function(data) {

      self.loading = true;

      //read file content
      var photoFile = data.files[0];
      var reader = new FileReader();

      reader.onload = function(e) {
        self.upload({fileName: photoFile.name, fileData: e.currentTarget.result, note: self.note});
      };
      reader.readAsDataURL(photoFile);
    };
  }

})();