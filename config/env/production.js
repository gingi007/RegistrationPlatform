var port = process.env.WEB_PORT || 80;
var host = process.env.IP || 'localhost';
var mongo = process.env.MONGO_URL || '';
var emailAddr = process.env.EMAIL_ADDR || '';
var emailPass = process.env.EMAIL_PASS || '';
var supportEmailAddr = process.env.SUPP_EMAIL_ADDR || '';
var adminEmail = process.env.ADMIN_EMAIL || '';
var eventname = 'Event Name';
var eventMediaLinks = {
	website: '',
	facebook: '',
	twitter: '',
	google: ''
};
var maxNumOfUsersInTeam = 4; // maximum supported currently is 6, can be only enforce 6 or lower.
module.exports = {
    port: port,
    host: host,
    db: mongo,
    emailAddr: emailAddr,
    emailPass: emailPass,
    supportEmailAddr:supportEmailAddr,
    eventname: eventname,
    eventwebsite: eventMediaLinks.website,
    eventMediaLinks: eventMediaLinks,
    maxNumOfUsersInTeam: maxNumOfUsersInTeam,
    adminEmail: adminEmail
};

