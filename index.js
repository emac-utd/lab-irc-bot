var irc = require('irc');
var _ = require('underscore');
var user = 'iamabotus';

var client = new irc.Client('irc.freenode.net', user, {
    channels: ['#EMAClab']
});

var ops = ['harrisonm', 'maaaaaax', 'afamiglietti', 'karlam', 'DeeptiN'];

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
