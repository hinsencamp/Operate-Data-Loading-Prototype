# Operate - Data Loading Prototype

Here you find a react [implementation](https://github.com/fh48/Operate-Data-Loading-Prototype-React) 

## Concept 

### Filter
* is changed by user 
* is trigger for updates of all other components

### Diagram 
* changes when 'workflow' Filter is changed 

### Statistics
* change when 'incident' Filter is changed
* changes when 'workflow' Filter is changed 

### Overlays 
* require statistics 
* require Diagram to be fully loaded 


## Requirements

### Update components about data loading state of other components 

Components load their data indepdendenly within their own scope. It exits the need for these components to be updated on the data loading state of other components (above, below & parallel in the hierachy) to be able to fetch their required data and render the correct UI elements. The data that is loaded in the local component scope isn't required by other components. 

Example: 
* *OverlayStatistics* - required Statistics to be loaded and Diagram to be loaded & rendered. No other Component requires the overlays. 

### Load Data centralised and distribute it to components

Multiple Components consume the same data which is loaded (& updated) in a global scope and available for any component to subscribe to updates of this data. 

Example: 
* *Header* - requires to load 3 metrics values to display it on three different views (Dashboard, InstanesList, InstanceDetails). The Dashboard also shows the same values on a MetricTile.


## Solution Sketch

Implement a Pub/Sub architecture which allows components to publish their own data loading updates & subscribe to other components status messages. The same architecture can be used to subscribe components to a global "DataLoading" Component which published messages whenever new data is available.   

## React Implementation 

React.Context can be used to make data available to any child component via props, no matter how deep in the hierachy.
Implement two context components. One is focused on subscription management, the global DataLoading context is added below the 
subscription manager.

### SubscriptionManager Component 
* stores list of topics
* sends published messages to subscribers by topic 


### GlobalDataLoading Component 
* fetches & stores data 
* polls for data updates 
* publishes 'loading states' fetched Data
* published 'fetched Data'

### Regular Component 
* publishes 'loading states' fetched Data
* publishes 'state changes' caused by user interaction (e.g. filters are being changed)
* published 'fetched Data'

* subsribes 'loading states' of locally or globally fetched data
* subscribes to globally 'fetched Data'
* subscribes to 'state changes'
