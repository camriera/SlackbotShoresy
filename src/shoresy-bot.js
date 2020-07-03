import Bot from 'slackbots';
import { Chirps } from './chirps.js';

function pickRandom(list) {
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

function chance(percentage) {
  return Math.random() * 100 <= percentage;
}

export class ShoresyBot extends Bot {  
  settings;
  user;

  /**
   * ShoresyBot Constructor
   * @param {token, name} settings
   */
  constructor(settings) {
    super(settings);
    Object.assign(this, settings);
  }

  run() {
    this.on('start', this.onStart);
    this.on('message', this.onMessage);
    console.log('bootstrapped');
  }

  /**
   * On Start callback, called when the bot connects to the Slack server and access the channel
   * @private
   */
  onStart = () => {
    this.user = this.users.find((user) => user.name === this.name);
    console.log('Shoresy bot:\n', this.user);

    //let people know bot is LIVE!
    //TODO figure out why DYNO instance reboots causing this to trigger wayyy to often
    this.broadcast(pickRandom(['Give yer balls a tug. Titfuckers!', 'Fight me, see what happens.']), 10);
  }

  /**
   * On message callback, called when a message (of any type) is detected with the real time messaging API
   * @param {object} message
   * @private
   */
  onMessage = (message) => {
    if (this.isChatMessage(message) && typeof message.channel === 'string' && /C|G|D/.test(message.channel[0]) && !this.isFromBot(message)) {
      //TODO add ability to define log level at the ENV and turn this to (debug|info|trace)
      console.log(message);

      //TODO update matching logic
      switch (true) {
        case /fuck.+you.+shoresy/gi.test(message.text):
          return this.postMessage(message, pickRandom(Chirps.fuckyou)
            .replace('#Name', this.getUserName(message.user))
            .replace('#Name2', this.getRandomChannelOrGroupUserName(message.channel, (user) => message.user !== user.id && user.id !== this.user.id && user.name !== 'slackbot')));
        case /what'?s?.+happen/gi.test(message.text):
          return this.postMessage(message, pickRandom(Chirps.threethings));
        case /gordie.+howe|mr.+hockey/gi.test(message.text):
          return this.postMessage(message, pickRandom(Chirps.mrhockey));  
        case /shoresy/gi.test(message.text):
          return this.postMessage(message, pickRandom(Chirps.chirp)
            .replace('#Name', this.getUserName(message.user))
            .replace('#Name2', this.getRandomChannelOrGroupUserName(message.channel, (user) => message.user !== user.id && user.id !== this.user.id && user.name !== 'slackbot')));
      }
    }
  }

  /**
   * Gets Random user's display name from a specific channel 
   * @param channelId 
   */
  getRandomChannelOrGroupUserName(channelOrGroupId, predicateFn) {
    const users = channelOrGroupId[0] === 'G' ? this.getGroupUsers(channelOrGroupId, predicateFn) : this.getChannelUsers(channelId, predicateFn);
    if (users.length > 0) {
      const user = pickRandom(users);
      return this.getUserName(user.id);
    } 
    //fallback to Jonesy || Reilly as name2
    return pickRandom(['Jonesy, Reilly']);
  }

  /**
   * Gets All users for a specific channel
   * @param channelId 
   * @param predicateFn 
   */
  getChannelUsers(channelId, predicateFn) {
    const members = this.getChannelById(channelId).members;
    let users = members ? members.map(userId => this.getUserById(userId)) : [];
    if (predicateFn) {
      users = users.filter(user => predicateFn(user));
    }
    return users;
  }

  getGroupUsers(groupId, predicateFn) {
    const members = this.getGroupById(groupId).members;
    let users = members ? members.map(userId => this.getUserById(userId)) : [];
    if (predicateFn) {
      users = users.filter(user => predicateFn(user));
    }
    return users;
  }

  /**
   * Util function to check if a given real time message object represents a chat message
   * @param {object} message
   * @returns {boolean}
   * @private
   */
  isChatMessage(message) {
    return message.type === 'message' && !!message.text;
  }

  /**
   * Util function to check if a given real time message object is directed to a channel
   * @param {object} message
   * @returns {boolean}
   * @private
   */
  isChannelConversation(message) {
    return typeof message.channel === 'string' && message.channel[0] === 'C';
  }

  /**
   * Util function to check if a given real time message object is directed to a group
   * @param message
   * @returns {boolean}
   * @private
   */
  isGroupConversation(message) {
    return typeof message.channel === 'string' && message.channel[0] === 'G';
  }

  /**
   * Util function to check if a given real time message is a Direct Message to a user
   * @param message
   * @returns {boolean}
   * @private
   */
  isDMConversation(message) {
    return typeof message.channel === 'string' && message.channel[0] === 'D';
  }

  /**
   * Util function to check if a given real time message object is directed to a Channel, Group, DM
   * @param message
   * @returns {boolean}
   */
  isChannelGroupOrDMConversation(message) {
    return this.isChannelConversation(message) ||
        this.isGroupConversation(message) ||
        this.isDMConversation(message);
  }

  isFromBot(message) {
    return message.user === this.user.id;
  }

    /**
   * Util function to check if a given real time message object is because of a channel_join event
   * @param {object} message
   * @returns {boolean}
   * @private
   */
  isChannelJoin(message) {
    return message.subtype === 'channel_join';
  }

  /**
   * Util function to check if channel_leave event
   * @param message
   * @returns {boolean}
   * @private
   */
  isChannelLeave(message) {
    return message.subtype === 'channel_leave';
  }

  /**
   * Util function to check if a group_join
   * @param message
   * @returns {boolean}
   * @private
   */
  isGroupJoin(message) {
    return message.subtype === 'group_join';
  }

  /**
   * Util function to check if group_leave event
   * @param message
   * @returns {boolean}
   * @private
   */
  isGroupLeave(message) {
    return message.subtype === 'group_leave';
  }

  /**
   * Util function to check if channel or group joins event
   * @param message
   * @returns {boolean}
   * @private
   */
  isChannelOrGroupJoin(message) {
    return this.isChannelJoin(message) || this._isGroupJoin(message);
  }

  /**
   * Util function to check if channel or group leave event occurs
   * @param message
   * @returns {boolean}
   * @private
   */
  isChannelOrGroupLeave(message) {
    return this.isChannelLeave(message) || this.isGroupLeave(message);
  }

  getUserById(userId) {
    return this.users.find((user) => user.id === userId);
  }

  getUserName(userId) {
    const user = this.getUserById(userId);
    return user.profile.display_name || user.name;
  }

  /**
   * Util function to post message either to channel or group
   * @param originalMessage
   * @param response
   * @private
   */
  postMessage(originalMessage, response, params = {as_user: true}) {
    super.postMessage(originalMessage.channel, response, params);
  }

  /**
   * Sends message to all channels/groups Bot is in
   */
  broadcast(msg, chanceVal = 100) {
    if (this.channels) {
      for (const channel of this.channels) {
        if (channel.is_member && chance(chanceVal)) { 
          this.postMessage({type: 'message', channel: channel.id}, msg);
        }
      }
    }
    if (this.groups){
      for (const group of this.groups) {
        console.log(group);
        if (group.is_group && group.members.some(member => member === this.user.id) && chance(chanceVal)){
          this.postMessage({type: 'message', channel: group.id}, msg);
        }
      }
    }
  }
}