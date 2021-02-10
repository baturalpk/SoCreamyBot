//** Dependencies, env variables ...
require('dotenv').config();
const Discord = require('discord.js');
const ytdl = require("discord-ytdl-core");
const { YTSearcher } = require('ytsearcher');
var http = require('http');
http.createServer((req, res) => {
    res.write('Hey! 👋'); 
}).listen(process.env.PORT || 3000);

// You should define your own YT_API token below (@process.env.YT_API) to avoid from restrictions of new YouTube Data API.
const searcher = new YTSearcher(process.env.YT_API); 

const PREFIX = '##'; // The default prefix for your all commands.

//** Client configurations
const client = new Discord.Client({
    ws: {
        properties: { $browser: "Discord Android" } // Set status as 'mobile'.
    }
});

client.on('ready', () => {
    console.log(`The ${client.user.username} is up!`);

    client.user.setUsername('SoCreamyBot'); // Change bot's name if you desire.

    
   /* Change game/app activity by replacing "process.env.ACTIVITY_STRING" to a custom string value or defining your own dotenv variable.
    * Type command does not accept value other than the following => 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING' | 'CUSTOM_STATUS' | 'COMPETING'
    * It shows like "PLAYING PacMan" or "STREAMING Mario  [First element => type, Second element => Activity_String]
    * Look at Discord.js documentation for more information.
    */
    client.user.setActivity(process.env.ACTIVITY_STRING, {
        type: "PLAYING"
    });
});

//** User-command handlers
client.on('message', async message => {
    // Interact w/ the messages that starts with defined PREFIX only.
    if (message.content.startsWith(PREFIX)) {
        if (message.content.startsWith(PREFIX + 'hey')) // #command1
            message.channel.send('Hello there ^^'); // #answer1

        else if (message.content.startsWith(PREFIX + 'balan')) // #command2
            message.channel.send(process.env.BALAN); // #answer2

        else if (message.content.startsWith(PREFIX + 'cem')) // #command3
            message.channel.send(process.env.CEM); // #answer3

        else if (message.content.startsWith(PREFIX + 'calc')) // #command4
            message.channel.send(DoSomeArithmetic(message.content)); // #answer4 ...

        else if (message.content.startsWith(PREFIX + 'play'))
            PlayMusic(message);

        else if (message.content.startsWith(PREFIX + 'clear'))
            ClearChat(message);

        else
            message.channel.send(process.env.NOT_FOUND); // `desired command is not supported`
    }
});

//** Start the bot
client.login(process.env.TOKEN); // DISCORD_ACCESS_TOKEN (Define your own token as dotenv variable or directly pass into here.)

/**
 * Solves four basic math operations (addition, subtraction, multiplication, division)
 * @param {Discord.Message} msg
 * @returns {string} 'result' of any arithmetic operation between 2 numbers OR 'error message'
 */
function DoSomeArithmetic(msg) {
    const ERROR = 'Oops! There would be an error, try something else.';
    msg = msg.trim().substr(PREFIX.length + 4); // Clear all the whitespaces then remove the command prefix
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
 * Plays your favorite music from YouTube.
 * @param {Discord.Message} message
 */
async function PlayMusic(message) {
    if (! message.member.voice.channel) 
        return message.channel.send("Please join a voice channel...");

    let searchValue = message.content.substr(5 + PREFIX.length)

    if (searchValue.length == 0) {
        message.channel.send("Invalid search parameters. Try again with a proper song name!")
        return;
    }

    let result = await searcher.search(searchValue);
    let URL = result.currentPage[0].url;
    message.channel.send(`Playing => ${URL}`);

    message.member.voice.channel.join().then(connection => {
        let dispatcher = connection.play(
            ytdl(URL, {
                filter: "audioonly",
                opusEncoded: false,
                fmt: "mp3",
                encoderArgs: ['-af', 'dynaudnorm=f=100']}), {
            type: "unknown"
        })
        .on("finish", () => {
            message.channel.send(`I'm leaving bye 👋`);
            message.guild.me.voice.channel.leave()
        });

        dispatcher.on('start', () => {
            console.log('The audio is playing');
        });
    });
}

/**
 * Clears the text chat where the command was executed.
 * @param {Discord.Message} msg 
 */
async function ClearChat(msg) {
    
    var count = parseInt(msg.content.substr(6 + PREFIX.length));

    if (isNaN(count)) {
        msg.channel.send("Invalid parameter. Try with a valid integer value!")
        return;
    }

    msg.channel.bulkDelete(count + 1); // Delete messages up to the desired count + the command itself
    await msg.reply(`Deleted ${count} messages succesfully 🗑️`)
        .then(message => {
            message.delete({timeout: 3000}); // Destroy 'success message' after 3 seconds.
        })
        .catch(err => {console.log(err)})
}
