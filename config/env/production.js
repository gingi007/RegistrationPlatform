var port = process.env.WEB_PORT || 80;
var host = process.env.IP || 'localhost';
var mongo = process.env.MONGO_URL || '';
var emailAddr = process.env.EMAIL_ADDR || '';
var emailPass = process.env.EMAIL_PASS || '';
var supportEmailAddr = process.env.SUPP_EMAIL_ADDR || '';
var adminEmail = process.env.ADMIN_EMAIL || '';
var eventname = 'MTA Hack';
var eventwebsite = 'http://mobedu13.mtacloud.co.il';
var eventfacebook = 'https://www.facebook.com/mtahack2017';
var maxNumOfUsersInTeam = 4; // maximum supported currently is 6, can be only enforce 6 or lower.
module.exports = {
    port: port,
    host: host,
    db: "mongodb://mta.hackathon:mtahack2017@ds145178.mlab.com:45178/registrationplatform",
    emailAddr: emailAddr,
    emailPass: emailPass,
    supportEmailAddr: supportEmailAddr,
    eventname: eventname,
    eventwebsite: eventwebsite,
    eventfacebook: eventfacebook,
    maxNumOfUsersInTeam: maxNumOfUsersInTeam,
    adminEmail: adminEmail
};

EMAIL_ADDR="mta.hackathon@gmail.com" EMAIL_PASS="mtahack2017" SUPP_EMAIL_ADDR="mta.hackathon@gmail.com" ADMIN_EMAIL="mta.hackathon@gmail.com"