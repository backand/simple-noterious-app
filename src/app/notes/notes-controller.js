(function () {
  'use strict';

  angular.module('noterious')
    .controller('NotesCtrl', ['BoardsModel', 'NotesModel', '$state', NotesCtrl]);

  function NotesCtrl (BoardsModel, NotesModel, $state) {
    var self = this;

    var boardId = $state.params.boardId;

    self._init = function () {
      self.resetForm();
    };

    self.goBack = function() {
      $state.go('boards');
    };

    self.resetForm = function () {
      self.loading = false;
      self.newNote = {
        title: '',
        content: ''
      };
    };

    self.getBoard = function () {
      BoardsModel.fetch(boardId)
        .then(function (board) {
          self.board = board;
          self.notes = board.notes;
        }, function (reason) {
          //
        });
    };

    self.createNote = function (note, isValid) {
      if (isValid) {
        self.loading = true;

        note.board = boardId;
        NotesModel.create(note)
          .then(function (result) {
            self.getBoard();
          })
          .catch(function (reason) {
            //
          })
          .finally(function() {
            self.resetForm();
          });
      }
    };

    self.updateNote = function (noteId, note, isValid) {
      if (isValid) {
        self.loading = true;

        //note.users.push({id:3});
        delete note.users; //todo: temp until the issue with the users will be fixed

        NotesModel.update(noteId, note)
          .then(function () {
            self.getBoard();
          })
          .catch(function (reason) {
            //
          })
          .finally(function() {
            self.resetForm();
          });
      }
    };

    self.deleteNote = function (noteId) {
      NotesModel.destroy(noteId)
        .then(function (result) {
          self.getBoard();
        })
        .catch(function (reason) {
          //
        })
        .finally(function() {
          self.cancelEditing();
        });
    };

    self.imageChanged = function(element, note) {
      var data = element;
      // $apply(function(scope) {
      var photofile = data.files[0];
      var filename = photofile.name;
      var reader = new FileReader();
      reader.onload = function(e) {
        var b64 = e.currentTarget.result;
        var filedata = b64;
        console.log('b64='+b64);
        //filedata = b64.substring(b64.indexOf("base64,") + 7);
        //console.log('filedata='+filedata);
        //var filedata = atob(filedata);
        //console.log('filedata='+filedata);
        NotesModel.s3FileUpload(filename, filedata, function(res){
          note.image = res.url;
        }, function(err){

        });
      };
      reader.readAsDataURL(photofile);
      // });

    };
    self.setEditedNote = function(noteId, note) {
      self.editedNoteId = noteId;
      self.editedNote = angular.copy(note);
      self.isEditing = true;
    };

    self.isCurrentNote = function(noteId) {
      return self.editedNote !== null && self.editedNoteId === noteId;
    };

    self.cancelEditing = function() {
      self.loading = false;
      self.editedNoteId = null;
      self.editedNote = null;
      self.isEditing = false;
    };

    self.getBoard();
  }

})();