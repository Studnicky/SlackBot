var request = require('request');

if(process.env.MEETUP_API_KEY){
	var meetup_api_key = process.env.MEETUP_API_KEY;
} else {
	console.log("** No Meetup API key in .env!");
}

var config = [
	'Design-with-a-Purpose',
	'familab',
	'OrlandoDevs',
	'Orlando-Tech',
	'Code-For-Orlando'
];
var colors = [
	'#7F1C1B',
	'#AC2624',
	'#AC2624',
	'#E53330',
	'#FF3835'
];

var meetup = {
	name: 'meetup',
	events: function(controller, bot){

		//	Show from a specific meetup by name
		controller.hears(['[find|get|list|show] meetup[s]? (.*)'], ['direct_message','direct_mention','mention'], function(bot,message) {
			//	Show typing indicator while API fetches
			bot.reply(message, {"type": "typing"});
			//	Get the important information...
			var query = message.match[1];
			var URI = 'https://api.meetup.com/' + query + '/events?&sign=true&page=5';
			//	Call meetup API to find 
			request(URI, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					//	Meetups are contained in body
					var meetups = JSON.parse(body);
					var attachments = parseEvents(meetups);

					var post = {
						channel: message.channel,
						username: 'Meetup',
						icon_emoji: ':meetup:'
					};
					if (attachments.length > 0){
						post.attachments = JSON.stringify(attachments);
					} else {
						post.text = "No meetups found!";
					}
					bot.api.chat.postMessage(post, function(err, response) {
						if(err){ return console.log(err); };
					});
				}
			});
		});

		//	Show from a specific meetup by name
		controller.hears(['[find|get|list|show] meetup[s]? [about|for] (.*) [near|in] (.*)'], ['direct_message','direct_mention','mention'], function(bot,message) {
			//	Show typing indicator while API fetches
			bot.reply(message, {"type": "typing"});
			//	Get the important information...
			var query = message.match[1];
			var city = message.match[2];
			var URI = 'https://api.meetup.com/2/open_events?photo-host=public&topic=' + query + '&city=' + city + '&key=' + meetup_api_key + '&sign=true&page=5';
			//	Call meetup API to find 
			request(URI, function (error, response, body) {
				if (!error && response.statusCode == 200) {

					console.log(body);

					//	Meetups are contained in body
					var meetups = JSON.parse(body);
					var attachments = parseEvents(meetups);
					var post = {
						channel: message.channel,
						username: 'Meetup',
						icon_emoji: ':meetup:'
					};
					if (attachments.length > 0){
						post.attachments = JSON.stringify(attachments);
					} else {
						post.text = "No meetups found!";
					}
					bot.api.chat.postMessage(post, function(err, response) {
						if(err){ return console.log(err); };
					});
				}
			});
		});
	}
}

function parseEvents(meetups){
	var attachments = [];
	//	Define array of attachments for each event...
	meetups.map(function(event, i){
		meetup = {	//	These fields are required by meetup and should always be here
			'fallback': event.name,
			'color': colors[i],
			'title': event.group.name + ': ' + event.name,
			'title_link': event.link,
			'fields': parseFields(event)
		};
		return attachments.push(meetup);
	});
	return attachments;
}

function parseFields(event){
	var fields = [];
	//	Make attachment fields... These are optional, use with caution!
	if(event.venue){
		fields.push({
			'fallback': event.venue.name || '',
			'title': 'Location',
			'value': (event.venue.name || '') + '\n' + (event.venue.address_1 || ''),
			"short": false
		});
	}
	if(event.time){
		fields.push({
			'fallback': new Date(event.time).toDateString() || '',
			'title': 'Date',
			'value': new Date(event.time).toDateString() || '',
			"short": true
		});
		fields.push({
			'fallback': new Date(event.time).toTimeString() || '',
			'title': 'Time',
			'value': new Date(event.time).toTimeString() || '',
			"short": true
		});
	}
	return fields;
}

module.exports = meetup;