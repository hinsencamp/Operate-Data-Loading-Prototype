/** Data Fetching Manager */

const DATA_STATES = {
  UNAVAILABLE: 'unavailable',
  LOAD_FAILED: 'failed',
  LOADING: 'loading',
  UNKNOWN: 'unknown',
  LOADED: 'loaded'
}

function DataManager(){
  this.subscribers = [];
}


DataManager.prototype.subscribe = function(topics, callback){
  this.subscribers.push({ topics, callback });
}

DataManager.prototype.publish = function(topic, value){
  this.subscribers.forEach((subscriber) => {
    if(subscriber.topics.includes(topic)){
      subscriber.callback(value);
    }
  })  

}

function Filter(){
  // filter change --> new Diagram
}

function Diagram(){
  // new Diagram loaded --> new Overlays need to be loaded
}

function Statistics(){
  // filter change --> new statistics are loaded
}


/** Setup */ 
const dataM = new DataManager();

dataM.subscribe(['filters', 'statistics', 'diagram'], (returnedData)=>{
console.log('I have got:', returnedData);
});

dataM.publish('diagram', 'diagramValue');
