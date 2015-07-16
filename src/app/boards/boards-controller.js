(function () {
'use strict';

angular.module('noterious')
  .controller('BoardsCtrl', BoardsModel);

  function BoardsModel () {
    var self = this;

    self.resetForm();
    self.getBoards();

    self.resetForm = function () {
      self.newBoard = {
        title: '',
        description: '',
        isPublic: false
      };
    };

    self.getBoards = function () {
      BoardsModel.all()
        .then(function (result) {
          self.boards = (result !== 'null') ? result : {};
        });
    };

    self.createBoard = function (board, isValid) {
      if (isValid) {
        BoardsModel.create(board)
          .then(function (result) {
            BoardsModel.createDefaultMember(result.id)
          })
          .then(function () {
              self.resetForm();
              self.getBoards();
          })
          .catch(function (reason) {
            // alert
          });
      }
    };

    self.deleteBoard = function (boardId) {
      BoardsModel.destroy(boardId)
        .then(function (result) {
          self.getBoards();
        })
        .catch(function (reason) {
          //
        })
        .finally(function () {
          self.cancelEditing();
        });
    };

    self.setEditedBoard = function (boardId, board) {
      self.editedBoardId = boardId;
      self.editedBoard = angular.copy(board);
      self.isEditing = true;
    };

    self.isCurrentBoard = function (boardId) {
      return self.editedBoard !== null && self.editedBoardId === boardId;
    };

    self.cancelEditing = function () {
      self.editedBoardId = null;
      self.editedBoard = null;
      self.isEditing = false;
    };

  }

})();