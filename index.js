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
    
    var d = new Date();
	var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    var din;
    console.log(agent.parameters);
    
    if(agent.parameters.day.length===0)
    {
      din=days[d.getDay()];
      console.log(din);
    }
    else{
      
      din = agent.parameters.day.toLowerCase();
      console.log(din);
    }
    
    agent.add('hola');
    
    //const hostel = agent.parameters.hostel;
    //const din = agent.parameters.day.toLowerCase();
    const menu = agent.parameters.menu.toLowerCase();
    
    console.log(agent.parameters);
    const cityRef = db.collection('College').doc('NITJ');
    return cityRef.get().then(function(doc){
      if(doc.exists){
        
        console.log(din,menu);
        //agent.add("inside doc");
        const full = doc.data();
        
        console.log(full[ 'Mess Menu' ][ 'Hostel 1' ][ din ][ menu ]);
        
        return agent.add(full[ 'Mess Menu' ][ 'Hostel 1' ][ din ][ menu ]);
      }
      else{
        console.log("No such document");
        return agent.add("error");
      }
    }).catch(function(error){
      console.log("error getting document",error);
    });
	    
  }
  
  function adviceseeker(agent) {
    
    //agent.add('heya');
    agent.add("Web links for "+agent.parameters.datascience[0]);
    console.log(agent.parameters);
    const value = agent.parameters.datascience[0].toLowerCase();
    console.log(typeof value);
    const courseRef = db.collection('College').doc('datascience');
    return courseRef.get().then(function(doc){
      if(doc.exists){
        
        console.log("===========Inside doc===========");
        console.log(doc.data());
        const docdata = doc.data();
        const courses=docdata.Data_Science;
        console.log(courses[value]);
        
        return agent.add(courses[value]);
      }
      else{
        console.log("No such document");
        return agent.add("error");
      }
    }).catch(function(error){
      console.log("error getting document",error);
    });
    
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Menu', menuteller);
  intentMap.set('Careeradvice', adviceseeker);
  agent.handleRequest(intentMap);
});
