## SoCreamyBot
An ordinary Discord bot built for fun with Discord.js
* Give a try on your Discord server: 
  - https://discord.com/oauth2/authorize?client_id=804465861963415563&scope=bot&permissions=8
  - !!! The bot's deployed on a free tier Heroku dyno. So you need to wake it up by pinging following URL (If you've already added the bot in your server, then you can see the bot is sleeping or not): https://so-creamy-bot.herokuapp.com/start

## Custom Setup
1) Git-clone or download the repository.

2) Execute the following command in the project directory to install npm dependencies:
  ```
  $ npm i
  ```
3) Configure your own API Tokens by creating ".env" file in the project directory or passing your credentials into the app directly. 
You can use [official Discord documentation](https://discord.com/developers/docs/intro) to learn how to set up your bot.
  * Additionally, you would want to obtain an authorization credential for YouTube Data API v3. Otherwise, the bot's music funcionality might encounter problems because of the Google's request limit on YouTube.
  
4) Apply your own commands and status if you desire. Look at the comment lines in the [app.js](https://github.com/baturalp-kiziltan/SoCreamyBot/blob/main/app.js) file for more information.

5) Raise the server up by executing following command at your project dir:
  ```
  $ node app.js
  ```
6) Finally, you can host the app on cloud hosting services such as Heroku, Glitch or AWS after some tests and minor tweaks on your local environment.
   * NOTE: Ffmpeg setup was a bit problematic for Heroku, but this [buildpack](https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest) will overcome the issue.
   
