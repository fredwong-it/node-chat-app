// Jan 1st 1970 00:00:00 am
const moment = require('moment');

var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var date = moment();
console.log(date.format('MMM YYYY'));
console.log(date.format('h:mm a'));
console.log(date.format('H:mm'));