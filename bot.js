// Dependencies =========================
var
    twit = require('twit'),
    config = require('./config');

var Twitter = new twit(config);

var trumpid = 0;
var jrmid = 0;
var rmid = 0;
var replyid = 0;
var trump_screen_name = 'realDonaldTrump';
var jrm_screen_name = 'Jacob_Rees_Mogg';
var rm_screen_name = 'mooresenate';
var reply_screen_name = '';
var frankscharities = ['MSF', 'MindCharity', 'amnesty', 'SSChospices', 'hrw', 'UNHumanRights', 'macmillancancer', 'CR_UK', 'NSPCC', 'Network4Africa'];

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;


// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
};

function getOptions(text) {
    return {
        url: 'https://django4j.imagine-have.xyz/s4j/p/',
        method: 'POST',
        headers: headers,
        form: {'prayer':  JSON.stringify( text ) }};
}


// database
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbase = db.db("heroku_npbd96ms");
    dbase.createCollection("tweetids", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});

function franksCharities(){
    
    var output = [];
    
    for(var i = 0; i < frankscharities.length; i++){
        output[i] = '@'+frankscharities[i];
    }
    
    return output;
    
}

// replyToTrump BOT ==========================

var replyToTrump = function() {
    
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
        screen_name: trump_screen_name,  
        result_type: 'recent',
        lang: 'en'
    };
    
    var callback = function(error, response, body) {
        if (!error && response.statusCode == 200) {
            
            body = JSON.parse(body);
            var passage = body['answer']['passage'];
            var book = body['answer']['book'];
            
            book = book.trim();
            
            if (book.match(/^\d/)) {
                var number = book.substring(0,1);
                book = book.substring(1);
                book += " " + number;
            }       
            
            var chapter = body['answer']['chapter'];
            var verse = body['answer']['verse'];
            
            var statusObj = {status: "@"+trump_screen_name+" \""+passage+"\" "+book+" "+chapter+":"+verse, in_reply_to_status_id: trumpid };
            
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
        console.log("trump spoke");
        console.log(data[0].text);
        var localTweetIdt = data[0].id_str;
        console.log(localTweetIdt);
        console.log(trump_screen_name);
        
        if(err) {
            console.log(err);
            return;
        } else { 
            var text = cleanString(data[0].text);
            var myobj = {tweetid:localTweetIdt};
            MongoClient.connect(url, function(err, db) {
                
                console.log("checking for previous trump replies");
                
                if (err) {
                    console.log(err);
                } else {
                    var dbase = db.db("heroku_npbd96ms");
                    dbase.collection("tweetids").findOne(myobj, function(err, result) {
                        
                        if (err) {
                            console.log(err);
                            console.log("(trump) Something went wrong with: "+localTweetIdt);
                        } else {
                            if(result !==null && result.tweetid === localTweetIdt){
                                console.log("already posted/replied");
                            } else {
                                var dbase = db.db("heroku_npbd96ms");
                                dbase.collection("tweetids").insertOne(myobj, function(err, res) {
                                    if (err) { 
                                        console.log("error inserting id");
                                        console.log(localTweetIdt);
                                        console.log(err);
                                    } else {
                                        console.log("inserted: " + localTweetIdt);
                                    }
                                });
                                
                                trumpid = localTweetIdt;
                                var request = require('request');
                            
                                console.log("sending request");
                                request(getOptions(text), callback);
                                
                            } 
                        }
                        console.log("exiting trump reply");
                        db.close();
                    });
                }
            });
        }
    });
};


// === reply to jacob
var replyToJRM = function() {
    
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
        screen_name: jrm_screen_name,  
        result_type: 'recent',
        lang: 'en'
    };
    
    var callback = function(error, response, body) {
        if (!error && response.statusCode == 200) {
            
            body = JSON.parse(body);
            var passage = body['answer']['passage'];
            var book = body['answer']['book'];
            
            book = book.trim();
            
            if (book.match(/^\d/)) {
                var number = book.substring(0,1);
                book = book.substring(1);
                book += " " + number;
            }       
            
            var chapter = body['answer']['chapter'];
            var verse = body['answer']['verse'];
            
            var statusObj = {status: "@"+jrm_screen_name+" \""+passage+"\" "+book+" "+chapter+":"+verse, in_reply_to_status_id: jrmid };
            
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
        console.log("jrm spoke");
        console.log(data[0].text);
        var localTweetIdjrm = data[0].id_str;
        console.log(localTweetIdjrm);
        console.log(jrm_screen_name);
        
        if(err) {
            console.log(err);
            return;
        } else { 
            var text = cleanString(data[0].text);
            var myobj = {tweetid:localTweetIdjrm};
            MongoClient.connect(url, function(err, db) {
                
                console.log("checking for previous jrm replies");
                
                if (err) {
                    console.log(err);
                } else {
                    var dbase = db.db("heroku_npbd96ms");
                    dbase.collection("tweetids").findOne(myobj, function(err, result) {
                        
                        if (err) {
                            console.log(err);
                            console.log("(jacob twat mogg) Something went wrong with: "+localTweetIdjrm);
                        } else {
                            if(result !==null && result.tweetid === localTweetIdjrm){
                                console.log("already posted/replied");
                            } else {
                                var dbase = db.db("heroku_npbd96ms");
                                dbase.collection("tweetids").insertOne(myobj, function(err, res) {
                                    if (err) { 
                                        console.log("error inserting id");
                                        console.log(localTweetIdjrm);
                                        console.log(err);
                                    } else {
                                        console.log("inserted: " + localTweetIdjrm);
                                    }
                                });
                                
                                jrmid = localTweetIdjrm;
                                var request = require('request');
                            
                                console.log("sending request");
                                request(getOptions(text), callback);
                                
                            } 
                        }
                        console.log("exiting jrm reply");
                        db.close();
                    });
                }
            });
        }
    });
};


// REPLY TO MOORE

// === reply to jacob
var replyToRM = function() {
    
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
        screen_name: rm_screen_name,  
        result_type: 'recent',
        lang: 'en'
    };
    
    var callback = function(error, response, body) {
        if (!error && response.statusCode == 200) {
            
            body = JSON.parse(body);
            var passage = body['answer']['passage'];
            var book = body['answer']['book'];
            
            book = book.trim();
            
            if (book.match(/^\d/)) {
                var number = book.substring(0,1);
                book = book.substring(1);
                book += " " + number;
            }       
            
            var chapter = body['answer']['chapter'];
            var verse = body['answer']['verse'];
            
            var statusObj = {status: "@"+rm_screen_name+" \""+passage+"\" "+book+" "+chapter+":"+verse, in_reply_to_status_id: rmid };
            
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
        console.log("rm spoke");
        console.log(data[0].text);
        var localTweetIdrm = data[0].id_str;
        console.log(localTweetIdrm);
        console.log(rm_screen_name);
        
        if(err) {
            console.log(err);
            return;
        } else { 
            var text = cleanString(data[0].text);
            var myobj = {tweetid:localTweetIdrm};
            MongoClient.connect(url, function(err, db) {
                
                console.log("checking for previous rm replies");
                
                if (err) {
                    console.log(err);
                } else {
                    var dbase = db.db("heroku_npbd96ms");
                    dbase.collection("tweetids").findOne(myobj, function(err, result) {
                        
                        if (err) {
                            console.log(err);
                            console.log("(roy paedo moore) Something went wrong with: "+localTweetIdrm);
                        } else {
                            if(result !==null && result.tweetid === localTweetIdrm){
                                console.log("already posted/replied");
                            } else {
                                var dbase = db.db("heroku_npbd96ms");
                                dbase.collection("tweetids").insertOne(myobj, function(err, res) {
                                    if (err) { 
                                        console.log("error inserting id");
                                        console.log(localTweetIdrm);
                                        console.log(err);
                                    } else {
                                        console.log("inserted: " + localTweetIdrm);
                                    }
                                });
                                
                                rmid = localTweetIdrm;
                                var request = require('request');
                            
                                console.log("sending request");
                                request(getOptions(text), callback);
                                
                            } 
                        }
                        console.log("exiting rm reply");
                        db.close();
                    });
                }
            });
        }
    });
};


// REPLY TO ANYONE STUFF

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
        count: 1
    };
    
    var callback = function(error, response, body) {
        if (!error && response.statusCode == 200) {
            
            body = JSON.parse(body);
            var passage = body['answer']['passage'];
            var book = body['answer']['book'];
            
            book = book.trim();
            
            if (book.match(/^\d/)) {
                var number = book.substring(0,1);
                book = book.substring(1);
                book += " " + number;
            }      
            
            var chapter = body['answer']['chapter'];
            var verse = body['answer']['verse'];
            
            console.log(replyid);
            
            var statusObj = {status: "@"+reply_screen_name+" \""+passage+"\" "+book+" "+chapter+":"+verse, in_reply_to_status_id: replyid };
            
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
    
    
    Twitter.get('statuses/mentions_timeline', params, function(err, data) {
        
        console.log("getting mentions");
        console.log(data[0].text);
        var localTweetId = data[0].id_str;
        reply_screen_name = data[0].user.screen_name;
        console.log(localTweetId);
        console.log(reply_screen_name);
        
        if(err) {
            console.log(err);
            return;
        } else { 
            var text = cleanString(data[0].text);
            var myobj = {tweetid:localTweetId};
            MongoClient.connect(url, function(err, db) {
                
                console.log("checking for previous replies");
                
                if (err) {
                    console.log(err);
                } else {
                    var dbase = db.db("heroku_npbd96ms");
                    dbase.collection("tweetids").findOne(myobj, function(err, result) {
                        
                        if (err) {
                            console.log(err);
                            console.log("(reply) Something went wrong with: "+localTweetId);
                        } else {
                            if(result !==null && result.tweetid === localTweetId){
                                console.log("already posted/replied");
                                
                            } else {
                                var dbase = db.db("heroku_npbd96ms");
                                dbase.collection("tweetids").insertOne(myobj, function(err, res) {
                                    if (err) { 
                                        console.log("error inserting id");
                                        console.log(localTweetId);
                                    } else {
                                        console.log("inserted: " + localTweetId);
                                    }
                                });
                                
                                replyid = localTweetId;
                                var request = require('request');
                                
                                console.log("sending request");
                                request(getOptions(text), callback);
                                
                            } 
                        }
                        console.log("exiting reply");
                        db.close();
                    });
                }
            });
        }
    });        

};

// RETWEET STUFF

// we only want the genuine article, and we don't want trump chat
function stripList(data) {
    
    var list = [];
    
    for (var i = 0; i < data.statuses.length; i++) {
        var status = data.statuses[i];
        if(frankscharities.indexOf(status.user.screen_name) !== -1){
            if(status.text.indexOf(trump_screen_name) === -1) {
                list[i] = data.statuses[i];
            }
        }
    }
    
    return list;
}


var retweet = function() {
    var params = {
        q: franksCharities().join(" OR "),
        result_type: 'recent',
        lang: 'en'
    };
    // for more parameters, see: https://dev.twitter.com/rest/reference/get/search/tweets

    Twitter.get('search/tweets', params, function(err, data) {
        // if there no errors
        if (!err) {
            
            data = stripList(data);
            
            if(data.length > 0) {
                
                var 
                    min = 0,
                    max = data.length;
                
                // randomise the charity
                var i = Math.floor(Math.random() * (max - min) + min); 
                
                var retweetId = data[i].id_str;
                
                Twitter.post('statuses/retweet/:id', {
                    id: retweetId
                }, function(err, response) {
                    if (response) {
                        console.log('Retweeted');
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


replyToTrump();
replyToJRM();
retweet();
reply();

function randomreplyToTrump() {
    
    var hour = new Date().getHours();
    // if the time is between 7am and 9pm
    if(hour > 7 && hour < 21) {
        // retweet
        replyToTrump();
    } else {
        console.log("Frank is sleeping");
    }
    
  var 
    min = 1000,
    max = 10000;
    
  var rand = Math.floor(Math.random() * (max - min + 1) + min); 
  console.log("Timeout replyToTrump for : " + rand);
  setTimeout(randomreplyToTrump, rand);
}
randomreplyToTrump();

function randomreplyToJRM() {
    
    var hour = new Date().getHours();
    // if the time is between 7am and 9pm
    if(hour > 7 && hour < 21) {
        // retweet
        replyToJRM();
    } else {
        console.log("Frank is sleeping");
    }
    
  var 
    min = 3000,
    max = 30000;
    
  var rand = Math.floor(Math.random() * (max - min + 1) + min); 
  console.log("Timeout replyToJRM for : " + rand);
  setTimeout(randomreplyToJRM, rand);
}
randomreplyToJRM();


function randomreplyToRM() {
    
    var hour = new Date().getHours();
    // if the time is between 7am and 9pm
    if(hour > 7 && hour < 21) {
        // retweet
        replyToRM();
    } else {
        console.log("Frank is sleeping");
    }
    
  var 
    min = 3000,
    max = 30000;
    
  var rand = Math.floor(Math.random() * (max - min + 1) + min); 
  console.log("Timeout replyToJRM for : " + rand);
  setTimeout(randomreplyToRM, rand);
}
randomreplyToRM();

function randomRetweet() {
    
    var hour = new Date().getHours();
    // if the time is between 7am and 9pm
    if(hour > 7 && hour < 21) {
        // retweet
        retweet();
    } else {
        console.log("Frank is sleeping");
    }
    
  var 
    min = 1860000,
    max = 3660000;
    
  var rand = Math.floor(Math.random() * (max - min + 1) + min); 
  console.log("Timeout retweet for : " + rand);
  setTimeout(randomRetweet, rand);
}
randomRetweet();

function randomReply() {
    
    var hour = new Date().getHours();
    // if the time is between 7am and 9pm
    if(hour > 7 && hour < 22) {
        // retweet
        reply();
    } else {
        console.log("Frank is sleeping");
    }
    
  var 
    min = 3000,
    max = 30000;
    
  var rand = Math.floor(Math.random() * (max - min + 1) + min); 
  console.log("Timeout reply for : " + rand);
  setTimeout(randomReply, rand);
}
randomReply();