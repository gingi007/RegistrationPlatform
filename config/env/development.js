var port = process.env.WEB_PORT || 80;
var host = process.env.IP || '127.0.0.1';
var mongo = process.env.MONGO_URL || '';
var emailAddr = process.env.EMAIL_ADDR || '';
var emailPass = process.env.EMAIL_PASS || '';
var supportEmailAddr = process.env.SUPP_EMAIL_ADDR || '';
var adminEmail = process.env.ADMIN_EMAIL || '';
var eventname = 'MTA Hack';
var eventMediaLinks = {
	website: '',
	facebook: '',
	twitter: '',
	google: ''
};
var eventfacebook = '';
var maxNumOfUsersInTeam = 4;
module.exports = {
	port: port,
	host: host,
	db: mongo,
	emailAddr: emailAddr,
	emailPass: emailPass,
	supportEmailAddr: supportEmailAddr,
	eventname: eventname,
	eventwebsite: eventMediaLinks.website,
	eventMediaLinks: eventMediaLinks,
	maxNumOfUsersInTeam: maxNumOfUsersInTeam,
	adminEmail: adminEmail
};

