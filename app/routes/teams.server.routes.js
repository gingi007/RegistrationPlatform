var teams = require('../../app/controllers/teams.server.controller'),
    users = require('../../app/controllers/users.server.controller'),
    params = require('../../app/controllers/params.server.controller'),
    passport = require('passport');

module.exports = function (app) {
    app.route('/teams')
        .post(params.isTeamsOpen, teams.logedIn, teams.verifyUserPermissionOnCDTeam, teams.preVerifyTeamCreate, teams.preVerifyNewTeamMembers, teams.create, teams.updateNewTeamMembers)
        .get(teams.logedIn, users.permissionCheck, teams.list);
    app.route('/teams/:teamId').get(params.isTeamsOpen, teams.logedIn, users.permissionCheck, teams.read)
        .put(params.isTeamsOpen, teams.logedIn, teams.verifyUserPermissionOnUpdateTeam, teams.preVerifyNewTeamMembers, teams.update, teams.updateUserMembership)
        .delete(params.isTeamsOpen, teams.logedIn, teams.verifyUserPermissionOnCDTeam, teams.updateRelatedMembers, teams.delete);
    app.route('/teams/:teamId/apply').post(params.isTeamsOpen, teams.logedIn, users.isInTeam, teams.addUserApplicationToTeam);
    app.route('/teams/:teamId/approve').post(teams.logedIn, teams.verifyUserPermissionOnCDTeam, teams.approveUserByTeamAdmin)
        .delete(teams.logedIn, teams.verifyUserPermissionOnCDTeam, teams.disapproveUserByTeamAdmin);
    app.route('/teams/:teamId/member').post(teams.logedIn, teams.verifyUserPermissionOnCDTeam, teams.addMemberToTeam)
        .delete(teams.logedIn, teams.verifyUserPermissionOnCDTeam, teams.removeTeamMemberFromTeam);
    app.route('/createTeam').get(params.isTeamsOpen, teams.logedIn, teams.createTeamPage);
    app.route('/updateTeam').get(params.isTeamsOpen, teams.logedIn, teams.createUpdateTeamPage);
    app.route('/myTeam').get(params.isTeamsOpen, teams.logedIn, teams.createMyTeamPage);

    app.param('teamId', teams.teamByID);

};