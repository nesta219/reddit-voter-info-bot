const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({region: 'us-east-1', apiVersion: '2012-08-10'});
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

const BOT_STAGE = process.env.BOT_STAGE || 'dev';

const STARTUP_TIME = new Date().getTime() / 1000;

replyRules.subreddits.forEach((subreddit) => {
    let comments = new CommentStream(client, {
        subreddit: subreddit.name,
        //limit: 10,
        pollTime: 10000
    });

    comments.on('item', (item) => processComment(subreddit, item));
});


const processComment = async (subreddit, comment) => {
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
            let replyTime = new Date().getTime() / 1000;
            let cachekey = `${comment.subreddit.display_name}_${comment.link_id}_${rule.category}`;

            console.log('Found auto-reply for comment');
            console.log({
                author: comment.author.name,
                permalink: comment.permalink,
                replyTime,
                category: rule.category,
                link_id: comment.link_id,
                comment_id: comment.id
            });

            if(await shouldReply({cachekey, comment, rule, replyTime})) {
               await sendReply({cachekey, comment, rule, replyTime})
            }

            break;
        }
    }
};

const sendReply = async ({cachekey, comment, rule, replyTime}) => {

    let replied = false;

    try {
        console.log('*** REPLYING ***.');
        comment.reply(rule.reply);
        replied = true;


    } catch(exception) {
        console.error('Error sending reply');
        console.log(exception);
    }

    if(replied) {
        let params;

        try {

            let commentDetails = {
                author: comment.author.name,
                permalink: comment.permalink,
                replyTime,
                category: rule.category,
                link_id: comment.link_id,
                comment_id: comment.id
            };

            params = {
                TableName: `RedditBotConfig-${BOT_STAGE}`,
                Item: {
                    'cachekey': {
                        S: cachekey
                    },
                    'commentdetails': {
                        S: JSON.stringify(commentDetails)
                    },
                    'subreddit': {
                        S: comment.subreddit.display_name
                    },
                    'link_title': {
                        S: comment.link_title
                    },
                    'author': {
                        S: comment.author.name
                    },
                    'permalink': {
                        S: comment.permalink
                    },
                    'body': {
                        S: comment.body
                    },
                    'link_id': {
                        S: comment.link_id
                    },
                    'comment_id': {
                        S: comment.comment_id
                    },
                    'commented_created_utc': {
                        N: `${comment.created_utc}`
                    },
                    'replyTimeReddit': {
                        N: `${replyTime}`
                    },
                    'replyTimeMillis': {
                        N: `${new Date().getTime()}`
                    }
                }
            };

            console.log(params);

            let results = await ddb.putItem(params).promise();

            console.log('Wrote details to ddb');
            console.log(results);

        } catch(exception) {
            console.error('Error writing to ddb');
            console.log(exception);
            console.log(params);
        }
    }
};



const shouldReply = async ({cachekey, comment, rule, replyTime}) => {
    if(comment.author.name === 'voter-info-bot') {
        console.log('Did not reply to comment because it was from the voter info bot');
        return false;
    }

    if(comment.created_utc < STARTUP_TIME) {
        console.log(`Did not reply because comment was issued before bot startup time`);
        return false;
    }

    if(comment.author.name === credentials.username && comment.subreddit.display_name !== 'testingground4bots') {
        console.log('Did not reply because the bot itself was the author of the comment');
        return false;
    }

    if(process.env.SUPRESS_REPLIES === 'true' && comment.subreddit.display_name !== 'testingground4bots') {
        console.log(`Did not reply because SUPPRESS_REPLIES env var was set to true`);
        return false;
    }

    //check for top level comment
    if(comment.parent_id !== comment.link_id) {
        console.log(`Did not reply because link was not a top level comment`);
        return false;
    }

    try {
        let ddbParams = {
            TableName: `RedditBotConfig-${BOT_STAGE}`,
            Key: {
                'cachekey': {S: cachekey}
            }
        };

        let results = await ddb.getItem(ddbParams).promise();

        console.log(`ddb results`);
        console.log(results);

        if(typeof results.Item !== 'undefined') {
            console.log(`Did not reply because we already replied in this thread for the rule of ${rule.category}`);
            return false;
        }

    } catch (ddbException) {
        console.error(ddbException);
        return false;
    }

    return true;
};