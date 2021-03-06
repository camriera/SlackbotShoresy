# SlackbotShoresy

![Shoresy Profile Pic](shoresy.jpg)

Liven up Slack with Shoresy! 

<!-- ![SlackbotShoresy in action](slackbot-shoresy-in-action.png) --> 

## Installation
Be sure to have npm and node installed, version `13.14.x` or later. 

```bash
$ npm install -g https://github.com/camriera/SlackbotShoresy.git
```
Verify that the package installs properly. From your package root directory, enter the following to install your package globally.

```bash
$ npm install . -g
```

## Running the SlackbotShoresy Locally

To run SlackbotShoresy you must have an [API token(#getting-the-api-token-for-your-slack-channel) to authenticate the bot on your slack channel.
Once you get it (instructions on the next paragraph) you just have to run:

```bash
BOT_API_KEY=secretapikey npm start
```

## Getting the API token for your Slack channel

To allow the SlackbotShoresy to connect your Slack channel you must provide him an API key. To retrieve it you need to add a new Bot in your Slack organization by visiting the following url: https://*yourorganization*.slack.com/services/new/bot, where *yourorganization* must be substituted with the name of your organization (e.g. https://*yourorganization*.slack.com/services/new/bot). Ensure you are logged to your Slack organization in your browser and you have the admin rights to add a new bot.

You will find your API key under the field API Token, copy it in a safe place and get ready to use it.

## Configuration

The SlackbotShoresy is configurable through environment variables. There are several variable available:

| Environment variable | Description |
|----------------------|-------------|
| `BOT_API_KEY` | this variable is mandatory and must be used to specify the API token needed by the bot to connect to your Slack organization |
| `BOT_NAME` | the name of your bot, it’s optional and it will default to shoresy |


## Launching the bot from source

If you downloaded the source code of the bot you can run it using NPM with:

```bash
$ npm run start
```

Don't forget to set your `BOT_API_KEY` environment variable bedore doing so. 

## Heroku Cloud Hosting

Optional cloud service provider that has free tier hosting for your bot. Click the link below and create an account, set your BOT_API_TOKEN throughthe web interface (under your app > settings > config vars) and you are good to go!

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Additionally, if you don't commit your API Token (Which you should definitely Git ignore) you can configure the environment variable for Heroku with:
```bash
$ heroku config:set BOT_API_KEY=[your-key-here]
```
