/** Data Fetching Manager */

const DATA_STATE = {
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

      this.dataManager.publish('data-state', DATA_STATE.LOADING)
      // Add fetching Data here

      this.diagram = {...this.diagram,
      name: newFilters.diagramName
      };

      this.dataManager.publish('data-state', DATA_STATE.LOADED)

    }  
});
}

function Overlays(dataManager){
  // filter change --> new statistics are loaded
  this.overlays = {};
  this.dataManager = dataManager
  // console.log('Diagram was updated:', this.diagram);
}

Overlays.prototype.subscribeForUpdates = function(){
  this.dataManager.subscribe(['data-state'], (newState)=>{
   
   if(newState === DATA_STATE.LOADED){
     console.log('overlays can now be  rendered');
    //  render Overlays
   }

  })
};
/** Setup */ 
const dataM = new DataManager();


const filter = new Filter(dataM);
const diagram = new Diagram(dataM);
diagram.subscribeForUpdates();

const overlays = new Overlays(dataM);
overlays.subscribeForUpdates();
// add new 
filter.changeAppliedFilters('diagramName', "ComplexWorkflow");

