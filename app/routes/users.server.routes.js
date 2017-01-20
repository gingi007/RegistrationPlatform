var users = require('../../app/controllers/users.server.controller'),
	params = require('../../app/controllers/params.server.controller'),
	passport = require('passport');

module.exports = function(app) {
	app.route('/users')
		.post(users.isUserAdminRole, params.isRegistrationOpen, users.create)
		.get(users.permissionCheck, users.list);

	app.route('/users/:userId')
		.get(users.logedIn, users.read)
		.put(users.isUserAdminRole, users.update)
		.delete(users.isUserAdminRole, users.delete);
	app.param('userId', users.userByID);

	app.route('/users/superadmin/:userId')
		.put(users.isUserSuperAdminRole, users.update);

	app.route("/resetme")
		.put(params.isRegistrationOpen, users.passer);
	app.route('/register')
		.get(params.isRegistrationOpen, users.renderRegister)
		.post(params.isRegistrationOpen, users.register);

	app.route('/user/leaveTeam').delete(users.logedIn, users.leaveTeam);
	app.route('/forgot').post(params.isRegistrationOpen, users.forgot);

	app.route('/resetme/:resetId').get(params.isRegistrationOpen, users.renderResetme);
	app.route('/printUsers').get(users.isUserAdminRole, users.renderPrintUsers);
	app.route('/adminspace').get(users.isUserAdminRole, users.renderAdminspace);

	app.route('/login')
		.get(users.renderLogin)
		.post(passport.authenticate('local', {
			successRedirect: '/team-up',
			failureRedirect: '/login',
			failureFlash: true
		}));
	app.route('/search_member')
		.get(users.logedIn, users.searchUserByEmailAutocomplete);

	app.route('/rsvp/:userIdToUpdate').get(users.userAgree);

	app.route('/reset').get(users.isUserAdminRole, users.renderReset);

	app.get('/logout', users.logout);

	app.post('/contactus', users.sendMail);
};