// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    // getting otu_ids
    const otu_ids = result.otu_ids;
    // getting otu lables
    const otu_labels = result.otu_labels;
    // getting sample values
    const sample_values = result.sample_values;

    // Build a Bubble Chart

    // creating trace for bubble chart
    const bacteriaBubble = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    // setting bubble chart layout
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID"},
      yaxis: { title: "Number of Bacteria"},
      hovermode: "clossest",
      margin: { t:30}
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bacteriaBubble, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const topOtuId = otu_ids.slice(0,10).reverse();
    const topSampleValue = sample_values.slice(0, 10).reverse();
    const topOtuLabel = otu_labels.slice(0, 10).reverse();
    // Creating trace for bar chart
    const bacteriaBar = [{
      x: topSampleValue,
      y: topOtuId.map(id => `OTU ${id}`),
      text: topOtuLabel,
      type: "bar",
    
    }];

    // Creating layout for bar chart
    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria"},
      yaxis: { title: ""},
      margin: {t: 30, l:100 }
    };
    
    // Render the Bar Chart
    Plotly.newPlot("bar", bacteriaBar, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    // loop through each sample id
    names.forEach((name) => {
      selector
      // adding new option
      .append("option")
      .text(name)
      .property("value", name);
    
  });

    // Get the first sample from the list
  const firstSample = names[0];

    // Build charts and metadata panel with the first sample
  buildCharts(firstSample);
  buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
