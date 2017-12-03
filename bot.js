// Dependencies =========================
var
    twit = require('twit'),
    config = require('./config');

var Twitter = new twit(config);

var utf8 = require("utf8")

var tweetid = 0
var screen_name = 'realDonaldTrump'

// RETWEET BOT ==========================

// find latest tweet according the query 'q' in params
var retweet = function() {

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
    }
    
    
    var twitter = function(error, tweetReply, response){
        
        //if we get an error print it out
        if(error){
            console.log(error);
        }
        
        //print the text of the tweet we sent out
        console.log(tweetReply.text);
    };
    
    var callback = function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body);
            
            // print out the text of the tweet that came in
            //console.log(tweet.text);
            
            //build our reply object
            
            var body = JSON.parse(body);
            
            var passage = body['answer']['passage']
            var book = body['answer']['book']
            var chapter = body['answer']['chapter']
            var verse = body['answer']['verse']
            
            var statusObj = {status: "@"+screen_name+" \""+passage+"\" "+book+" "+chapter+":"+verse, in_reply_to_status_id: tweetid };
            
            console.log(statusObj);
            
            Twitter.post('statuses/update', statusObj,  function(error, tweetReply, response){

                //if we get an error print it out
                if(error){
                console.log(error);
                }
                
                //print the text of the tweet we sent out
                console.log(tweetReply.text);
                
                console.log(response)
            });
        }
    };
    
    
    Twitter.get('statuses/user_timeline', params, function(err, data) {
        
        console.log(data[0])
        
        console.log(data[0].text)
        var text = cleanString(data[0].text);
        tweetid = data[0].id
        
        console.log(text)
        
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
            console.log("sending request")
            request(options, callback);
        }
        // if unable to Search a tweet
        else {
          console.log('Something went wrong while searching');
        }
    });
}

// grab & retweet as soon as program is running...
retweet();
// retweet in every 50 minutes
setInterval(retweet, 3000000);