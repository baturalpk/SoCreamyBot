const Discord = require('discord.js');
require('dotenv').config();
const PREFIX = '#';

const client = new Discord.Client({
    ws: {
       properties: { $browser: "Discord Android" } // Set status as 'mobile'
    }});

client.on('ready', () => {
    console.log(`The ${client.user.username} is up!`);

    client.user.setUsername('SoCreamyBot');

    /*** Change game/app activity e.g. "Playing PacMan" ***/
    client.user.setActivity(process.env.ACTIVITY_STRING2, {
        type: "PLAYING"
    });
});

client.on('message', message => {
    if (message.content.charAt(0) === PREFIX) {
        if (message.content.startsWith('#hey'))
            message.channel.send('Hello there ^^');

        else if (message.content.startsWith('#balan'))
            message.channel.send(process.env.BALAN);

        else if (message.content.startsWith('#cem'))
            message.channel.send(process.env.CEM);

        else
            message.channel.send(process.env.NOT_FOUND);
    }
});

client.login(process.env.TOKEN);