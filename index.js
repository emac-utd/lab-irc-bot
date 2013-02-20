var irc = require('irc');
var _ = require('underscore');
var mongoose = require('mongoose');
    mongoose.connect('localhost', 'lab-irc-bot');

    var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function callback () {
            console.log('db connected');
        });

var user = 'iamabotus';

var Schema = mongoose.Schema;
var emacronymSchema = new Schema({
    topic: {type: String, required: true, index: true},
    by: {type: String},
    votes: {type: Number},
    createdAt: { type: Date, default: Date.now }
});
var Emacronym = mongoose.model('Emacronym', emacronymSchema);


var client = new irc.Client('irc.freenode.net', user, {
    channels: ['#EMAClab']
});

var ops = ['harrisonm', 'maxme', 'afamiglietti', 'karlam', 'DeeptiN'];

client.addListener('join#EMAClab', function(nick,message){

    //Auto-op
    if(_.indexOf(ops, nick) != -1)
    {
        client.say('NickServ', 'ACC ' + nick);
        console.log("Sent ACC request");
    }

});

client.addListener('notice', function(from, to, text, message){
    
    console.log("Receieved message");

    //Auto-op
    if(from == 'NickServ')
    {
        console.log("Received ACC result");

        var words = text.split(' ');

        if(words[2] == '3' && _.indexOf(ops, words[0]) != -1)
        {
            client.send('MODE', '#EMAClab', '+o', words[0]);
            console.log("Matched user");
        }
    }

});

client.addListener('message#EMAClab', function (from, message) {
    var emac;
    if (message.substring(0,6) == '!EMAC ') {
        console.log('matches');
        emac = {
            by: from,
            means: message.substring(6)
        };

        client.send('TOPIC','#EMAClab', emac.means );
        var emacronym = new Emacronym({
            topic: emac.means,
            by: emac.by,
            votes: 0
        });

        emacronym.save(function (err, emacronym) {
            if (err) // TODO handle the error
                console.log('error saving');
        });


    }


});




