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
            let cachekey = `${comment.subreddit.display_name}-${comment.link_id}-${rule.category}-${comment.id}`;

            if(await shouldSaveComment({cachekey, comment})) {
                console.log('Found relevant comment');
                await savecomment({cachekey, comment})
            }

            break;
        }
    }
};

const savecomment = async ({cachekey, comment}) => {
    let params;

    try {

        params = {
            TableName: `RedditBotConfig-${BOT_STAGE}`,
            Item: {
                'cachekey': {
                    S: cachekey
                },
                'id': {
                    S: comment.id
                },
                'created_utc': {
                    N: `${comment.created_utc}`
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
                'commented_created_utc': {
                    N: `${comment.created_utc}`
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
    
};



const shouldSaveComment = async ({cachekey, comment}) => {
    if(comment.author.name === 'voter-info-bot') {
        return false;
    }

    if(comment.created_utc < STARTUP_TIME) {
        return false;
    }

    if(comment.author.name === credentials.username && comment.subreddit.display_name !== 'testingground4bots') {
        return false;
    }

    if(process.env.SUPRESS_REPLIES === 'true' && comment.subreddit.display_name !== 'testingground4bots') {
        return false;
    }

    return true;
};