'use strict';
const Alexa = require('alexa-sdk');
const p = require('./particle.js');

const led = '<say-as interpret-as="spell-out">led</say-as>';
const languageString = {
    "de-DE": {
        "translation": {
            "WELCOME_MESSAGE": "Schalter ist gestartet. ",
            "STOP_MESSAGE": "Beendet. ",
            "ON_MESSAGE": `${led} ist an.`,
            "OFF_MESSAGE": `${led} ist aus.`,
            "HELP_MESSAGE": `Schalte ${led} an oder Schalte ${led} aus.`,
            "HELP_REPROMPT": `Schalte ${led} an oder Schalte ${led} aus.`,
            "ERROR_MESSAGE": "Das hat leider nicht funktioniert. "
        }
    }
};

const password = process.env.PASSWORD;
const username = process.env.USERNAME;
const deviceid = process.env.DEVICEID;
const appid    = process.env.APPID;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appid;  
    alexa.resources = languageString;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        const self = this; 
        p.particle_get_token(username,password).then(  
            access_token => {
                self.attributes["token"] = access_token;
                const speechOutput = self.t('WELCOME_MESSAGE');
                self.emit(':ask',speechOutput);
      
            },
            err => {
                console.log(`Fehler: ${err}`);
            }
        );
    },
    'SwitchOnIntent': function () {
        this.emit('Call','switchon',this.t('ON_MESSAGE')); 
    }      
    ,
    'SwitchOffIntent': function () {
        this.emit('Call','switchoff',this.t('OFF_MESSAGE'));     
    },
    'Call': function(func,message) {
        const self = this; 
        if(this.attributes["token"]) {
            let access_token=this.attributes["token"];
            p.particle_function_call(access_token,deviceid,func).then( 
                body => {
                    const speechOutput = message; 
                    self.emit(':ask', speechOutput); 
                },
                err => {
                    console.log(`${err}`);
                    const speechOutput = this.t('ERROR_MESSAGE');
                    self.emit(':tell',speechOutput);
                    // TODO: end here
                }
            );
        }
        else {
           const speechOutput = this.t('ERROR_MESSAGE');
           self.emit(':tell',speechOutput); 
           // TODO: end here
        }

    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    }
};