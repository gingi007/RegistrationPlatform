var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema,
	Q = require('q'),
	config = require('../../config/config');

var ROLES = {
	SuperAdmin: 'superAdmin',
	Admin: 'admin',
	Student: 'student'
};

var ERROR_TYPE = {
	USER_ALREADY_IN_TEAM: 120,
	USER_NOT_FOUND: 121
};

var UserSchema = new Schema({
	first_name: String,
	last_name: String,
	email: {
		type: String,
		trim: true,
		unique: true,
		required: 'Email address is required',
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
	},
	phone: String,
	inst: String,
	degree: String,
	tshirt: String,
	food: String,
	tags: Object,
	gender: String,
	yearOfDegree: String,
	degreeType: String,
	needPC: {type: Boolean, default: false},
	regDate: String,
	accepted: {type: Boolean, default: false},
	isMember: {type: Boolean, default: false},
	team: {type: String, default: ''},
	resetPass: String,
	password: String,
	provider: String,
	providerId: String,
	providerData: {},
	role: {
		type: String,
		default: ROLES.Student
	},
	appliedTeams: []
});

UserSchema.static('findByEmail', function(email, callback) {
	return this.findOne({email: email}, callback);
});

UserSchema.pre('save', function(next) {
		if (this.isModified('password')) {
			var md5 = crypto.createHash('md5');
			this.password = md5.update(this.password).digest('hex');
		}
		next();
	}
);

UserSchema.pre('findOneAndUpdate', function(next) {
	if (this._update.password) {
		var md5 = crypto.createHash('md5');
		this._update.password = md5.update(this._update.password).digest('hex');
	}
	next();
});

UserSchema.methods.authenticate = function(password) {
	var md5 = crypto.createHash('md5');
	md5 = md5.update(password).digest('hex');

	return this.password === md5;
};

UserSchema.statics.findUniqueUsername = function(email, suffix, callback) {
	var _this = this;
	var possibleEmail = email + (suffix || '');

	_this.findOne(
		{email: possibleEmail},
		function(err, user) {
			if (!err) {
				if (!user) {
					callback(possibleEmail);
				}
				else {
					return _this.findUniqueUsername(email, (suffix || 0) + 1, callback);
				}
			}
			else {
				callback(null);
			}
		}
	);
};


UserSchema.statics.isAdmin = function(user) {
	if (user && user.email.toLowerCase() === config.adminEmail.toLowerCase()) {
		return true;
	}
	return false;
};

UserSchema.statics.addTeamApplyToUser = function(user, teamId) {
	var deferred = Q.defer();
	this.findOne({_id: user._id}, function(err, user) {
		if (err) {
			deferred.reject(err);
		} else {
			var appliedTeams = user.appliedTeams || [];
			appliedTeams.push(teamId);
			user.appliedTeams = appliedTeams;
			user.save(function(err) {
				if (err) {
					deferred.reject(err);
				} else {
					deferred.resolve({user: user, teamId: teamId});
				}
			});
		}
	});
	return deferred.promise;
};

UserSchema.methods.removeTeamFromAppliedList = function(teamId) {
	var teamInd = this.appliedTeams.indexOf(teamId);
	if (teamInd !== -1) {
		this.appliedTeams.splice(teamInd, 1);
	}
};

UserSchema.methods.moveFromAppliedToApproveTeam = function(teamId) {
	this.removeTeamFromAppliedList(teamId);
	this.team = teamId;
	this.isMember = true;
};

UserSchema.statics.approveTeamOnUser = function(userEmail, teamId) {
	var deferred = Q.defer();
	this.findOne({email: userEmail}, function(err, user) {
		if (err) {
			deferred.reject(err);
		} else {
			if (user.isMember) {
				user.removeTeamFromAppliedList(teamId);
				user.save(function(err) {
					if (err) {
						deferred.reject(err);
					}
				});
				deferred.reject({code:ERROR_TYPE.USER_ALREADY_IN_TEAM});
			} else {
				user.moveFromAppliedToApproveTeam(teamId);
				user.save(function(err, user) {
					if (err) {
						deferred.reject(err);
					} else {
						deferred.resolve({user: user, teamId: teamId});
					}
				});
			}
		}
	});
	return deferred.promise;
};

UserSchema.statics.dispproveTeamOnUser = function(userEmail, teamId) {
	var deferred = Q.defer();
	this.findOne({email: userEmail}, function(err, user) {
		if (err) {
			deferred.reject(err);
		} else {
			user.removeTeamFromAppliedList(teamId);
			user.save(function(err) {
				if (err) {
					deferred.reject(err);
				} else {
					deferred.resolve({user: user, teamId: teamId});
				}
			});
		}
	});
	return deferred.promise;
};

UserSchema.statics.addTeamToUser = function(userEmail, teamId) {
	var deferred = Q.defer();
	this.findOne({email: userEmail}, function(err, user) {
		if (err) {
			deferred.reject(err);
		} else {
			if (!user) {
				deferred.reject({code:ERROR_TYPE.USER_NOT_FOUND});
			} else {
				if (user.isMember) {
					deferred.reject({code:ERROR_TYPE.USER_ALREADY_IN_TEAM});
				} else {
					user.isMember = true;
					user.team = teamId;
					user.save(function(err) {
						if (err) {
							deferred.reject(err);
						} else {
							deferred.resolve({user: user, teamId: teamId});
						}
					});
				}
			}
		}
	});
	return deferred.promise;
};

UserSchema.statics.removeTeamFromUser = function(userEmail, teamId) {
	var deferred = Q.defer();
	this.findOneAndUpdate({email: userEmail}, {isMember: false, team: ''}, function(err, user) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve({user: user, teamId: teamId});
		}
	});
	return deferred.promise;
};

module.exports = {
	ROLES: ROLES,
	USER_ERROR_TYPES: ERROR_TYPE
};

mongoose.model('User', UserSchema);