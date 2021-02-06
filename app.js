
//** Dependencies, env variables ...
require('dotenv').config();
const Discord = require('discord.js');
const ytdl = require("discord-ytdl-core");
const { YTSearcher } = require('ytsearcher');
const searcher = new YTSearcher(process.env.YT_API);
const PREFIX = '#'; // The command prefix.

//** Client configurations
const client = new Discord.Client({
    ws: {
        properties: { $browser: "Discord Android" } // Set status as 'mobile'
    }
});

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

//** User-command handlers
client.on('message', async message => {
    // Interact w/ the messages that starts with '#' prefix only.
    if (message.content.charAt(0) === PREFIX) {
        if (message.content.startsWith('#hey')) // #command1
            message.channel.send('Hello there ^^'); // #answer1

        else if (message.content.startsWith('#balan')) // #command2
            message.channel.send(process.env.BALAN); // #answer2

        else if (message.content.startsWith('#cem')) // #command3
            message.channel.send(process.env.CEM); // #answer3

        else if (message.content.startsWith('#calc'))
            message.channel.send(DoSomeArithmetic(message.content));

        else if (message.content.startsWith('#play'))
            PlayMusic(message);

        else
            message.channel.send(process.env.NOT_FOUND); // `desired command is not supported`
    }
});

//** Start the bot
client.login(process.env.TOKEN); // ACCESS_TOKEN (Define your own dotenv variable or directly pass into here.)

/**
 * @description SIMPLE MATH SOLVER
 * @param {Discord.message} msg
 * @returns {string} 'result' of any arithmetic operation between 2 numbers OR 'error message'
 */
function DoSomeArithmetic(msg) {
    const ERROR = 'Oops! There would be an error, try something else.';
    msg = msg.trim().substr(5); // Clear all the whitespaces then remove the command prefix
    var result;
    var operands;

    // The calculation part
    if (msg.includes('add')) {
        operands = msg.split('add');
        if (operands.length != 2)
            return ERROR;
        else
            result = parseFloat(operands[0]) + parseFloat(operands[1]);
    }
    else if (msg.includes('sub')) {
        operands = msg.split('sub');
        if (operands.length != 2)
            return ERROR;
        else
            result = parseFloat(operands[0]) - parseFloat(operands[1]);
    }
    else if (msg.includes('mul')) {
        operands = msg.split('mul');
        if (operands.length != 2)
            return ERROR;
        else
            result = parseFloat(operands[0]) * parseFloat(operands[1]);
    }
    else if (msg.includes('div')) {
        operands = msg.split('div');
        if (operands.length != 2)
            return ERROR;
        else
            result = parseFloat(operands[0]) / parseFloat(operands[1]);
    }
    else
        return ERROR;

    // Check the result whether it is consistent or not.
    if (isNaN(result))
        return ERROR;
    else
        return result + '';
}

/**
 * @param {Discord.message} message 
 * @returns
 */
async function PlayMusic(message) {
    if (! message.member.voice.channel) 
        return message.channel.send("Please join a voice channel...");

    let result = await searcher.search(message.content.substr(6));
    let URL = result.currentPage[0].url;
    console.log(URL);

    let stream = ytdl(URL, {
        filter: "audioonly",
        opusEncoded: false,
        fmt: "mp3",
        encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
    });

    message.member.voice.channel.join().then(connection => {
        let dispatcher = connection.play(stream, {
            type: "unknown"
        })
        .on("finish", () => {
            message.guild.me.voice.channel.leave()
        });

        dispatcher.on('start', () => {
            console.log('The audio is playing');
        });
    });
}