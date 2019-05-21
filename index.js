/** Data Fetching Manager */

const DATA_STATE = {
  UNAVAILABLE: 'unavailable',
  LOAD_FAILED: 'failed',
  LOADING: 'loading',
  UNKNOWN: 'unknown',
  LOADED: 'loaded'
}

// The DataManager allows components to publish and subscribe to events.
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

// When the applied filter is changed the new filter is published
function Filter(dataManager){
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
  this.dataManager.subscribe(['filters'], ({diagramName})=>{
    if(diagramName != this.diagram.name){
      this.dataManager.publish('diagram-state', {diagramState: DATA_STATE.LOADING})
      // Add fetching Data here
      setTimeout(() => {
        this.diagram = {...this.diagram,
        name: diagramName
        }
        this.dataManager.publish('diagram-state', {diagramState:DATA_STATE.LOADED})
      }, 4500, 'funky'); 
    }
});
}

// New statistics are fetched when ever the filter changes. 
function Statistics(dataManager){
  this.statistics = {};
  this.dataManager = dataManager
}

Statistics.prototype.subscribeForUpdates =function(){
  this.dataManager.subscribe(['filters'], ({diagramName,incidents})=> {
    this.dataManager.publish('statistics-state', {statisticsState: DATA_STATE.LOADING})
    setTimeout(() => {
        this.statistics = {...this.statistics,
        incidents
        }
        this.dataManager.publish('statistics-state', {statisticsState: DATA_STATE.LOADED})
      }, 1500, 'funky'); 
    
    })
  };

// Overlays can be rendered after statistics have been fetched and a diagram exists.
function Overlays(dataManager){
  this.overlays = {};
  this.preRequirements = {};
  this.dataManager = dataManager
}

Overlays.prototype.subscribeForUpdates = function(){
  this.dataManager.subscribe(['diagram-state', 'statistics-state'], (newState)=>{
    
   if(!!newState.diagramState && newState.diagramState === DATA_STATE.LOADED){
     this.preRequirements = {...this.preRequirements, diagram: DATA_STATE.LOADED}
    console.log('diagram loaded');
   }

   if(!!newState.statisticsState && newState.statisticsState === DATA_STATE.LOADED){
     this.preRequirements = {...this.preRequirements, statistics: DATA_STATE.LOADED}
     console.log('statistics loaded');
     
   }

   if(this.preRequirements.statistics && this.preRequirements.diagram){
     console.log('render overlays')
   }

  })
};



/** Setup */ 
const dataM = new DataManager();


const filter = new Filter(dataM);
const diagram = new Diagram(dataM);
diagram.subscribeForUpdates();

const statistics = new Statistics(dataM);
statistics.subscribeForUpdates();

const overlays = new Overlays(dataM);
overlays.subscribeForUpdates();
// add new 
filter.changeAppliedFilters('diagramName', "ComplexWorkflow");

