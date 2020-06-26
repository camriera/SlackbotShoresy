#!/usr/bin/env node
'use strict';

import { ShoresyBot } from 'slackbot-shoresy';
import { BOT_API_KEY } from '../token.mjs';

try {
  /**
   * Environment variables used to configure the bot:
   *
   *  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization. You can get your
   *      token at the following url: https://<yourorganization>.slack.com/services/new/bot (Mandatory)
   *  BOT_NAME: the username you want to give to the bot within your organization.
   */
  const token = process.env.BOT_API_KEY || BOT_API_KEY;
  const name = process.env.BOT_NAME || 'shoresy';
  //const useGIFs = process.env.BOT_USE_GIFS || true;

  const SlackBot = new ShoresyBot({token, name});
  SlackBot.run();
} catch(err) {
  console.error('Fatal exception occurred running SlackBot', err);
}


