// park.js ~ Copyright 2017 Manchester Makerspace ~ MIT License

var slack = {
    webhook: require('@slack/client').IncomingWebhook,   // url to slack intergration called "webhook" can post to any channel as a "bot"
    URL: process.env.SLACK_WEBHOOK_URL,
    send: function(msg, channel){
        properties = {
            username: 'Camera Bot',
            channel: channel,
            iconEmoji: ':camera:'
        };
        if(channel === 'privategroup'){properties.channel = 'test_channel';}
        var sendObj = new slack.webhook(slack.URL, properties);
        sendObj.send(msg);
    }
};

var route = {
    park: function(){
        return function(req, res){
            if(req.body){
                res.status(200).send('https://cam.pinesec.org/parking/front/image.jpg');res.end();             // ACK notification
                console.log(JSON.stringify(req.body, null, 4));
                slack.send('https://cam.pinesec.org/parking/front/image.jpg', req.body.channel_name);
            }
        };
    }
};

var serve = {                                                // handles express server setup
    express: require('express'),                             // server framework library
    parse: require('body-parser'),                           // middleware to parse JSON bodies
    theSite: function(){                                     // method call to serve site
        serve.app = serve.express();                         // create famework object
        var http = require('http').Server(serve.app);        // http server for express framework
        serve.app.use(serve.parse.json());                   // support JSON bodies
        serve.app.use(serve.parse.urlencoded({extended: true})); // idk, something was broken maybe this fixed it
        serve.router = serve.express.Router();               // create express router object to add routing events to
        serve.router.post('/park', route.park());          // Don't ask
        serve.app.use(serve.router);                         // get express to user the routes we set
        return http;
    }
};

var http = serve.theSite();
http.listen(process.env.PORT);
