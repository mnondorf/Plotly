function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("../samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}
// Demographics Panel 
function buildMetadata(sample) {
  d3.json("../samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}
// Create the buildCharts function.
function buildCharts(sample) {

  // Use d3.json to load and retrieve the samples.json file 
  d3.json("../samples.json").then((data) => {

    // Create a variable that holds the samples array. 
    var samArray = data.samples;
    var metaArray = data.metadata;

    // Create a variable that filters the samples for the object with the desired sample number.
    var samNumArray = samArray.filter(sampleObj => sampleObj.id == sample);
    
       // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaSam = metaArray.filter(sampleObj => sampleObj.id == sample);
   
    // Create a variable that holds the first sample in the array.
    var sampleData = samNumArray[0];

     // 2. Create a variable that holds the first sample in the metadata array.
     var metaData = metaSam[0];
   
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = sampleData.otu_ids;
    var otuLabels = sampleData.otu_labels;
    var samVals = sampleData.sample_values;

    // 3. Create a variable that holds the washing frequency.
   var washFreq = parseFloat(metaData.wfreq);

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order so the otu_ids with the most bacteria are last.
  
    var yticks = otuIDs.slice(0,10).reverse().map(id => `OTU ID: ${id}`);

    var xVals = samVals.slice(0,10).reverse();
    
    // Create the trace for the bar chart. 
    var barData = [{
      type: "bar",
      x: xVals,
      y: yticks,
      orientation: "h",
      text: otuLabels.slice(0,10).reverse()
    }];

    // Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"};

    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDs,
      y: samVals,
      text: otuLabels,
      mode: 'markers',
      marker: {size: samVals,
      color: otuIDs,
      colorscale: "Earth"}
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest"
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      value: washFreq,
      mode: "gauge+number",
      gauge: {
        axis: {range: [0,10], dtick: 2},
        bar: {color: "black"},
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "yellowgreen"},
          {range: [8,10], color: "green"}
        ],
      }
    }];  
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: {
        text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
        y: 0.75,
      },
      margin: {
        l: 50,
        r: 50,
        b: 0,
        t: 50,
        pad: 50
      },
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}