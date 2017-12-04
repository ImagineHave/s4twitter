// Dependencies =========================
var
    twit = require('twit'),
    config = require('./config');

var Twitter = new twit(config);

var tweetid = 0;
var screen_name = 'realDonaldTrump';

// REPLY BOT ==========================

var reply = function() {

    function cleanString(input) {
        var output = "";
        for (var i=0; i<input.length; i++) {
            if (input.charCodeAt(i) <= 127) {
                output += input.charAt(i);
            }
        }
        return output;
    }
    
    var params = {
        screen_name: screen_name,  
        result_type: 'recent',
        lang: 'en'
    };
    
    var callback = function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body);
            
            // print out the text of the tweet that came in
            //console.log(tweet.text);
            
            //build our reply object
            
            body = JSON.parse(body);
            
            var passage = body['answer']['passage'];
            var book = body['answer']['book'];
            
            if (book.match(/^\d/)) {
                var number = book.substring(1);
                book += number;
            }       
            
            var chapter = body['answer']['chapter'];
            var verse = body['answer']['verse'];
            
            console.log(tweetid);
            
            var statusObj = {status: "@"+screen_name+" \""+passage+"\" "+book+":"+chapter+":"+verse, in_reply_to_status_id: tweetid };
            
            console.log(statusObj);
            
            Twitter.post('statuses/update', statusObj,  function(error, tweetReply, response){

                //if we get an error print it out
                if(error){
                    console.log(error);
                }
                
                //print the text of the tweet we sent out
                console.log(tweetReply.text);
                
            });
        }
    };
    
    
    Twitter.get('statuses/user_timeline', params, function(err, data) {
        
        //console.log(data[0]);
        
        console.log(data[0].text);
        var text = cleanString(data[0].text);
        
        if (tweetid === data[0].id_str){
            console.log("already done");
            return;
        } 
        
        tweetid = data[0].id_str;
        
        console.log(text);
        
        var request = require('request');
    
        // Set the headers
        var headers = {
            'User-Agent':       'Super Agent/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
        };
        
        // Configure the request
        var options = {
            url: 'https://s4j.imagine-have.xyz/s4j/p/',
            method: 'POST',
            headers: headers,
            form: {'prayer':  JSON.stringify( text ) }
        };
        
        // if there no errors
        if (!err) {
            console.log("sending request");
            request(options, callback);
        }
        // if unable to Search a tweet
        else {
          console.log('Something went wrong while searching');
        }
    });
};


var retweet = function() {
    var params = {
        q: '@MSF OR @MindCharity OR @amnesty OR @SSChospices OR @hrw OR @UNHumanRights OR @macmillancancer OR @CR_UK OR @NSPCC OR #UKCharityWeek OR @Network4Africa',  // REQUIRED
        //q: '#UKCharityWeek, #ukcharityweek',
        result_type: 'recent',
        lang: 'en'
    };
    // for more parameters, see: https://dev.twitter.com/rest/reference/get/search/tweets

    Twitter.get('search/tweets', params, function(err, data) {
        // if there no errors
        if (!err) {
            
            if(data.statuses.length > 0) {
                
                var 
                    min = 0,
                    max = data.statuses.length;
                
                var i = Math.floor(Math.random() * (max - min) + min); 
                
                // grab ID of tweet to retweet
                var retweetId = data.statuses[i].id_str;
                // Tell TWITTER to retweet
                Twitter.post('statuses/retweet/:id', {
                    id: retweetId
                }, function(err, response) {
                    if (response) {
                        console.log('Retweeted!!!');
                    }
                    // if there was an error while tweeting
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
        // if unable to Search a tweet
        else {
          console.log(err);
        }
    });
};


//reply();
//retweet();
//setInterval(reply, 10000);
//setInterval(retweet, 906000);
function randomReply() {
    
    var hour = new Date().getHours();
    // if the time is between 7am and 9pm
    if(hour > 7 && hour < 21) {
        // retweet
        reply();
    }
    
  var 
    min = 1000,
    max = 10000;
    
  var rand = Math.floor(Math.random() * (max - min + 1) + min); 
  console.log("Timeout reply for : " + rand)
  setTimeout(randomReply, rand);
}

randomReply();


function randomRetweet() {
    
    var hour = new Date().getHours();
    // if the time is between 7am and 9pm
    if(hour > 7 && hour < 21) {
        // retweet
        retweet();
    }
    
  var 
    min = 1860000,
    max = 3660000;
    
  var rand = Math.floor(Math.random() * (max - min + 1) + min); 
  console.log("Timeout retweet for : " + rand)
  setTimeout(randomRetweet, rand);
}

randomRetweet();
