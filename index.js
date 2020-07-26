// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const {Firestore} = require('@google-cloud/firestore');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

const firestore = new Firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Heya!Welcome to coolage,How can i help u?`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function menuteller(agent) {
    
    agent.add('hola');
    const hostel = agent.parameters.hostel;
    const din = agent.parameters.day.toLowerCase();
    const menu = agent.parameters.menu.toLowerCase();
    //agent.add(typeof agent.parameters.day);
    console.log(agent.parameters);
    const cityRef = db.collection('College').doc('NITJ');
    return cityRef.get().then(function(doc){
      if(doc.exists){
        
        console.log(din,menu,hostel);
        //agent.add("inside doc");
        const full = doc.data();
        //const hostel = agent.parameters.hostel.toString();
        //const foodtime = agent.parameters.menu.toLowerCase();
        //const dayval = agent.paramters;
        //const value=menu.hostel.dayval.foodtime;
        //console.log(dayval);
        console.log(full[ 'Mess Menu' ][hostel][ din ][ menu ]);
        
        return agent.add(full[ 'Mess Menu' ][hostel][ din ][ menu ]);
      }
      else{
        console.log("No such document");
        return agent.add("error");
      }
    }).catch(function(error){
      console.log("error getting document",error);
    });
	    
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Menu', menuteller);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
