'use strict';

import allTweets from './uw_ischool_tweets';

console.log(allTweets.length);

allTweets.map((tweet) => {
    let simpleTweet = {
        text: tweet.text,
        timestamp: Date.parse(tweet.created_at)   
    }
    return simpleTweet;
})

tweet.sort((first, second) => second.timestamp - first.timestamp);

export function getRecentTweets() {
    return allTweets.slice(0, 5)
}

export function serachTweets(query) {
    return tweet.filter((tweet) => tweet.text.toLowerCase().indexOf(query) >= 0)
}