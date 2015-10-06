(function () {
  'use strict';

  angular.module('noterious')
    .directive('board', [BoardDirective]);

  function BoardDirective() {
    return {
      scope: {
        board: '=',
        remove: '&',
        update: '&',
        member: '&'
      },
      templateUrl: 'app/boards/board.tmpl.html',
      controller: BoardController,
      controllerAs: 'boardCtrl',
      bindToController: true
    }
  }

  function BoardController() {
    var self = this;

    self._init = function () {
      self.loading = false;
    };

    self.updateBoard = function(){
      self.loading = true;
      self.update({boardId: self.board.id, board: self.board})
      .then(function () {
        self.loading = false;
      });
    }

    self.deleteBoard = function(){
      self.loading = true;
      self.remove({boardId: self.board.id})
          .then(function () {
            self.loading = false;
          });
    }

    self.updateMember = function(member){
      self.member({member: member, board: self.board});
    }

    self._init();
  }

})();