var port = process.env.WEB_PORT || 80;
var host = process.env.IP || '127.0.0.1';
var mongo = process.env.MONGO_URL || '';
var emailAddr = process.env.EMAIL_ADDR || '';
var emailPass = process.env.EMAIL_PASS || '';
var supportEmailAddr = process.env.SUPP_EMAIL_ADDR || '';
var eventname = 'MTA Hack';
var eventMediaLinks = {
	website: 'http://www.mtahack.com',
	facebook: 'https://www.facebook.com/mtahack2017',
	twitter: 'https://twitter.com/mtahackathon',
	google: 'https://plus.google.com/u/1/113260219787307001341/'
};
var eventfacebook = '';
var maxNumOfUsersInTeam = 4;
var adminEmail = 'mta.hackathon@gmail.com';
module.exports = {
	port: port,
	host: host,
	db: 'mongodb://localhost/registrationplatform',
	emailAddr: 'mta.hackathon@gmail.com',
	emailPass: 'mtahack2017',
	supportEmailAddr: 'mta.hackathon@gmail.com',
	eventname: eventname,
	eventwebsite: eventMediaLinks.website,
	eventMediaLinks: eventMediaLinks,
	maxNumOfUsersInTeam: maxNumOfUsersInTeam,
	adminEmail: adminEmail
};

