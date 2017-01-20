var Team = require('mongoose').model('Team');
var Param = require('mongoose').model('Param'),
	config = require('../../config/config'),
	Roles = require('./../models/user.server.model').ROLES;

/**
 * This method renders
 * @param req
 * @param res
 */
var defaultMenu = [
		{name: 'Home', path: '/', isActive: true},
		{name: 'Logout', path: '/logout', isActive: false}
	],
	defaultTitle = 'Welcome';


exports.render = function(req, res) {
	if (req.user) {
		if (req.user.isMember) {
			Team.findOne({_id: req.user.team}, function(err, team) {
				if (err) {
					res.render('index', {
						user: req.user,
						pageTitle: defaultTitle,
						menu: defaultMenu,
						eventName: config.eventname,
						footerData : config.eventMediaLinks
					});
				} else {
					var index = team.members.indexOf(team.admin_email);
					team.members.splice(index, 1);
					res.render('index', {
						user: req.user,
						pageTitle: defaultTitle,
						team: team,
						menu: defaultMenu,
						eventName: config.eventname,
						footerData : config.eventMediaLinks
					});
				}
			});
		} else {
			res.render('index', {
				user: req.user,
				pageTitle: defaultTitle,
				menu: defaultMenu,
				eventName: config.eventname,
				footerData : config.eventMediaLinks
			});
		}
	} else {
		res.render('index', {
			user: '',
			pageTitle: defaultTitle,
			menu: [{name: 'Home', path: '/', isActive: true}],
			messages: req.flash('error'),
			eventName: config.eventname,
			footerData : config.eventMediaLinks
		});
	}
};
exports.renderMingle = function(req, res) {
	if (req.user) {
		Team.find({}, function(err, teams) {
			res.render('mingle', {
				user: req.user,
				menu: defaultMenu,
				pageTitle: 'Mingling',
				teams: teams,
				eventName: config.eventname,
				footerData : config.eventMediaLinks
			});
		});
	} else {
		return res.redirect('/team-up');
	}

};

exports.isTimerOn = function(req, res, next) {
	Param.find({name: "timer"}, function(err, param) {
		if (err) {
			return next(err);
		} else if (!param) {
			res.status(403).send("close")
		} else if (!param.isOpen) {
			res.status(200).send("close")
		} else {
			res.status(200).send("on")
		}
	})
};

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
	var j, x, i;
	for (i = a.length; i; i -= 1) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
}