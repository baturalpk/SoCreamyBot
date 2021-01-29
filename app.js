const Discord = require('discord.js');
require('dotenv').config();
const PREFIX = '#'; // The command prefix.

const client = new Discord.Client({
    ws: {
       properties: { $browser: "Discord Android" } // Set status as 'mobile'
    }});

client.on('ready', () => {
    console.log(`The ${client.user.username} is up!`);

    client.user.setUsername('SoCreamyBot');

    /*
    * Change game/app activity e.g. "PLAYING PacMan" or "STREAMING Mario "
    * [ First element => type, Second element => Activity_String ]
    */
    client.user.setActivity(process.env.ACTIVITY_STRING2, {
        type: "PLAYING"
    });
});

client.on('message', message => {
    // Interact w/ the messages that starts with '#' prefix only.
    if (message.content.charAt(0) === PREFIX) {
        if (message.content.startsWith('#hey')) // #command1
            message.channel.send('Hello there ^^'); // #answer1

        else if (message.content.startsWith('#balan')) // #command2
            message.channel.send(process.env.BALAN); // #answer2

        else if (message.content.startsWith('#cem')) // #command3
            message.channel.send(process.env.CEM); // #answer3

        else
            message.channel.send(process.env.NOT_FOUND); // `desired command is not supported`
    }
});

client.login(process.env.TOKEN); // ACCESS_TOKEN (Define your own dotenv variable or directly pass into here.)
