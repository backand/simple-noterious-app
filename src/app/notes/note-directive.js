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
        fileChanged: '&'
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

    self.updateNoteImage = function (elem) {
      self.fileChanged({element: elem, note: self.note});
    };
  }

})();