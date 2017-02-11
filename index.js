'use strict';
const Alexa = require('alexa-sdk');
const p = require('./particle.js');

const led = '<say-as interpret-as="spell-out">led</say-as>';
const languageString = {
    "de-DE": {
        "translation": {
            "WELCOME_MESSAGE": "Schalter ist gestartet. ",
            "STOP_MESSAGE": "Beendet. ",
            "HELP_MESSAGE": `Schalte ${led} an oder Schalte ${led} aus.`,
            "HELP_REPROMPT": `Schalte ${led} an oder Schalte ${led} aus.`,
            "ERROR_MESSAGE": "Das hat leider nicht funktioniert. "
        }
    }
};

const password = process.env.PASSWORD;
const username = process.env.USERNAME;
const deviceid = process.env.DEVICEID;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = "amzn1.ask.skill.860835bf-d7b4-45ef-82f7-2d0fb6b6710d";  
    alexa.resources = languageString;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        const speechOutput = this.t('WELCOME_MESSAGE');
        this.emit(':ask',speechOutput);

        // hier token holen und über session attribute mitführen (outer promise)
    },
    'SwitchOnIntent': function () {
        const self = this; 
        console.log(username+' '+password);
        p.particle_get_token(username,password).then(  
            access_token => {
                console.log(access_token);
                p.particle_function_call(access_token,deviceid,'switchon').then( 

                    body => {
                        const speechOutput = `${led} ist an.`; //+' '+access_token+' '+deviceid+' '+username+' '+password; 
                        self.emit(':tell', speechOutput); 
                    },
                    err => {
                        console.log(`${err}`);
                        const speechOutput = this.t('ERROR_MESSAGE'+access_token);
                        self.emit(':tell',speechOutput);
                         //beenden
                    }
                );
            },
            err => {
                console.log(`Fehler: ${err}`);
            }
        );
    },
    'SwitchOffIntent': function () {
        const self = this; 
        console.log(username+' '+password);
        p.particle_get_token(username,password).then(  
            access_token => {
                console.log(access_token);
                p.particle_function_call(access_token,deviceid,'switchoff').then( 

                    body => {
                        const speechOutput = `${led} ist aus.`; //+' '+access_token+' '+deviceid+' '+username+' '+password; 
                        self.emit(':tell', speechOutput); 
                    },
                    err => {
                        console.log(`${err}`);
                        const speechOutput = this.t('ERROR_MESSAGE'+access_token);
                        self.emit(':tell',speechOutput);
                         //beenden
                    }
                );
            },
            err => {
                console.log(`Fehler: ${err}`);
            }
        ); 
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