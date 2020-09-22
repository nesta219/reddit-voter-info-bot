const Snoowrap = require('snoowrap');
const { CommentStream } = require('snoostorm');
const replyRules = require('./config/replyRules.js');

const credentials = {
    "userAgent": process.env.USER_AGENT,
    "clientId": process.env.CLIENT_ID,
    "clientSecret": process.env.CLIENT_SECRET,
    "username": process.env.REDDIT_USERNAME,
    "password": process.env.REDDIT_PASSWORD
};

const client = new Snoowrap(credentials);

const STARTUP_TIME = new Date().getTime() / 1000;
const COOLDOWN_TIME = 480; //8 minute cooldown time
const cooldowns = {};

replyRules.subreddits.forEach((subreddit) => {
    let comments = new CommentStream(client, {
        subreddit: subreddit.name,
        //limit: 10,
        pollTime: 10000
    });

    comments.on('item', (item) => processComment(subreddit, item));
});


const processComment = (subreddit, comment) => {
    if(comment.created_utc < STARTUP_TIME) return;

    if(comment.author.name === credentials.username && comment.subreddit.display_name !== 'testingground4bots') return;

    console.log('New comment');
    console.log(subreddit);
    console.log(comment.author);
    console.log(comment.permalink);
    console.log(comment.body);
    console.log('');

    for(let i = 0; i < replyRules.rules.length; i++) {
        let rule = replyRules.rules[i];

        let foundAllKeywords = true;

        for(let j = 0; j < rule.keywords.length; j++) {
            let keyword = rule.keywords[j];

            if(!comment.body.toLowerCase().includes(keyword) ) {
                foundAllKeywords = false;
                break;
            }
        }

        if(foundAllKeywords) {
            console.log('Found auto-reply for comment');
            sendReply(subreddit, comment, rule.reply);
            break;
        }
    }
};

const sendReply = (subreddit, comment, replyText) => {
    let replyTime = new Date().getTime() / 1000;

    if(cooldowns[subreddit] && (replyTime - cooldowns[subreddit] < COOLDOWN_TIME) ) {
        console.log(`Did not reply because of cooldown. ${replyTime - cooldowns[subreddit]} seconds remaining`);
        return;
    }

    try {
        console.log('*** REPLYING ***.');
        comment.reply(replyText);
        cooldowns[subreddit] = replyTime;
        console.log('');
    } catch(exception) {
        console.error('Error sending reply');
        console.log(exception);
    }
};