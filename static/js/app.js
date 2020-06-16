//Create function to display the plots
function displayIdPlots(id){
// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named dataset as the argument
d3.json("data/samples.json").then((dataset) => {
    console.log(dataset);
  var data = dataset;
    
   //Get sample values for the ID

  var Idsamples = data.samples.filter(samp => samp.id === id)[0];
        
    console.log(Idsamples);
  
  // Slice the first 10 objects for plotting
  var samples = Idsamples.sample_values.slice(0,10);
  var otuids = Idsamples.otu_ids.slice(0,10);
  var otulabels = Idsamples.otu_labels.slice(0, 10);

  console.log(samples);
  console.log(otuids);
  console.log(otulabels);

  // Reverse the array due to Plotly's defaults
  samples = samples.reverse();
  otuids = otuids.reverse();
  otulabels = otulabels.reverse();

    // Trace1 for the id Data horizontal bar chart
    var trace1 = {
      x: samples,
      y: otuids.map(row => "OTU " + row),
      text: otulabels,
      name: "otu",
      type: "bar",
      orientation: "h"
    };
  
    // data
    var chartData = [trace1];
  
    // Apply the group bar mode to the layout
    var layout1 = {
      title: "Top 10 OTUs",
      xaxis: {title: "Sample values"},
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
  
    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", chartData, layout1);

    // Trace2 for the id Data horizontal bar chart

    var trace2 = {
      x: Idsamples.otu_ids,
      y: Idsamples.sample_values,
      text: Idsamples.otu_labels,
      mode: 'markers',
      marker: {
        color: Idsamples.otu_ids,
        size: Idsamples.sample_values
      }
    };
  
    // data
    var chartData2 = [trace2];
  
    // Apply the bubble chart layout
    var layout2 = {
      title: "Sample Data Chart",
      xaxis:{title: "OTU ID"},
      showlegend: false,
      height:600,
      width:1000
      }
    
    Plotly.newPlot("bubble",chartData2, layout2);

  })};

  //Display the metadata in the Demographic Info section

  function displayDemoInfo(id){
    d3.json("data/samples.json").then((dataset) => {
      console.log(dataset);

    var metadata = dataset.metadata;

    console.log(metadata)


    var metadataID = metadata.filter(meta => meta.id.toString() === id)[0];

     // select demographic panel to put data
     var demoInfo = d3.select("#sample-metadata");
        
     // empty the demographic info panel each time before getting new id info
     demoInfo.html("");


    Object.entries(metadataID).forEach((key) => {   
      demoInfo.append("h5").text(key[0] + ": " + key[1] + "\n");  
    });  
  })};

// create the function for the change event
function optionChanged(id) {
  displayIdPlots(id);
  displayDemoInfo(id);
}

// create the function for the initial data rendering
function init() {
  // select dropdown menu 
  var dropdownMenu = d3.select("#selDataset");

  // read the data 
  d3.json("data/samples.json").then((dataset)=> {
      //console.log(dataset)

      // get the id data to the dropdwown menu
      var names = dataset.names;
      console.log(names);

      names.forEach(function(name) {
        dropdownMenu.append("option").text(name).property("value");
      });

      // call the functions to display the data and the plots to the page
      displayIdPlots(dataset.names[0]);
      displayDemoInfo(dataset.names[0]);
  });
}

init();