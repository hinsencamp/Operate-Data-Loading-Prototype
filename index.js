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

function Filter(dataManager){
  // filter change --> new Diagram
  this.appliedFilters = {
    diagramName: "someWorkflow",
    incidents: true
  }
  this.dataManager = dataManager;
}

Filter.prototype.changeAppliedFilters = function(key, newValue){
  this.appliedFilters = { ...this.appliedFilters, [key]: newValue}
  this.dataManager.publish('filters', this.appliedFilters)
}

function Diagram(dataManager){
  // new Diagram loaded --> new Overlays need to be loaded
  this.diagram = { name: ""};
  this.dataManager = dataManager;
}


Diagram.prototype.subscribeForUpdates = function(){
  this.dataManager.subscribe(['filters'], (newFilters)=>{
    if(newFilters.diagramName != this.diagram.name){

      // Add fetching Data here

      this.diagram = {...this.diagram,
      name: newFilters.diagramName
      };
      console.log('Diagram was updated:', this.diagram);
    }  
});
}

function Statistics(){
  // filter change --> new statistics are loaded
}

/** Setup */ 
const dataM = new DataManager();


const filter = new Filter(dataM);
const diagram = new Diagram(dataM);
diagram.subscribeForUpdates();

// add new 
filter.changeAppliedFilters('diagramName', "ComplexWorkflow");
