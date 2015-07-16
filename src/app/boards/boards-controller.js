(function () {
'use strict';

angular.module('noterious')
  .controller('BoardsCtrl', ['BoardsModel', BoardsCtrl]);

  function BoardsCtrl (BoardsModel) {
    var self = this;

    self._init = function() {
      self.boards = BoardsModel.boards;
      self.resetForm();
      self.getBoards();
    };

    self.getBoards = function () {
      BoardsModel.getUsersBoards();
    };

    self.resetForm = function () {
      self.newBoard = {
        title: '',
        description: '',
        isPublic: false
      };
    };

    self.createBoard = function (board, isValid) {
      if (isValid) {
        BoardsModel.create(board)
          .then(function (result) {
            //
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

    self._init();
  }

})();