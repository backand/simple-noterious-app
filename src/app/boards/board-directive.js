angular.module('noterious')
  .directive('board', function(BoardsModel, MemberModel){
    var controller = function() {
      var self = this;

      self.board.isPublic = !!self.board.isPublic;
      self.loading = false;

      self.updateBoard = function () {
        self.loading = true;
        BoardsModel.update(self.boardId, self.board, false)
          .then(function (result) {
            console.log('result', result);
          })
          .catch(function (reason) {
            //
          })
          .finally(function () {
            self.loading = false;
          });
      };

      self.deleteBoard = function () {
        self.remove({boardId: self.boardId});
      };

      self.updateMember = function (member) {
        return member.isMember ? addMemberToBoard(member) : removeMemberFromBoard(member);
      };

      function addMemberToBoard (member) {
        return BoardsModel.addMemberToBoard(self.boardId, member)
          .then(function (data) {
            member.users_boards_id = data.id;
          }, function (error) {
            member.users_boards_id = null;
            member.isMember = false;
          })
      }

      function removeMemberFromBoard (member) {
        return MemberModel.destroy(member.users_boards_id)
          .then(function (data) {
            member.users_boards_id = null;
          }, function (error) {
            member.isMember = true;
          })
      }

    };

    return {
      scope: {
        boardId:'@',
        board:'=',
        allUsers:'=',
        remove:'&'
      },
      templateUrl: 'app/boards/board.tmpl.html',
      controller: controller,
      controllerAs: 'boardCtrl',
      bindToController: true
    }
  })
;