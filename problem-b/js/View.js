'use strict';

import{ getRecentTweets} from './Model';

export function printTweets(tweets) {
    if(tweets.length === 0) {
        console.log("No tweets found");
        return;
    }


    tweets.forEach((tweet) => {
        let date = new Date(tweet.timestamp).toLocaleDateString("en-US");
        console.log("- ", tweet.text, "("+date+")");
    })
}

printTweets( getRecentTweets() ) 