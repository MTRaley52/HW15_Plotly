function buildMetadata(sample) {
console.log("buildMetadata");
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
     //adding metadata to the end of the URL from python app.py for meta data
  d3.json("http://127.0.0.1:5000/metadata/" + sample).then(function (metabacteria) {
    console.log(metabacteria);
    var panel = d3.select("#sample-metadata");
    panel.html(""); // Using `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata. 
  for (let [key,value] of Object.entries(metabacteria)) {
      panel.append("text").text(key + ": " + value+"\n");
      //appending new tags for each key-value
    }
  });

}

function buildCharts(sample) {
 console.log("buildCharts");
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  //adding samples to the end of the URL from python app.py for sample data
 function buildPlot1() {
    d3.json("http://127.0.0.1:5000/samples/" + sample).then(function (bacteria) {
      console.log(bacteria);
      //slice to ONLY take the top 10
          var samples = bacteria.sample_values.slice(0, 10);
          var otu_ids = bacteria.otu_ids.slice(0, 10);
          var otu_labels = bacteria.otu_labels.slice(0, 10);
          console.log(otu_labels);
          var trace = {
            labels: otu_ids,
            values: samples,
            type: 'pie'

          };
          var layout = {
            title: "Belly Button Biodiversity: Pie Chart",
            height: 525,
            width: 525
          };
          var data = [trace];

          Plotly.newPlot("pie", data, layout);
        });


      }
          // @TODO: Use `d3.json` to fetch the sample data for the plots
        function buildPlot2() {
           d3.json("http://127.0.0.1:5000/samples/" + sample).then(function (newbacteria) {
             console.log(newbacteria);
              //slice to ONLY take the top 10
                 var samples = newbacteria.sample_values.slice(0, 10);
                 var otu_ids = newbacteria.otu_ids.slice(0, 10);
                 var otu_labels = newbacteria.otu_labels.slice(0, 10);
                 console.log(otu_labels);
                 //building the bubble plot
                 var trace = {
                   x: otu_ids,
                   y: newbacteria.sample_values,
                   text: otu_labels,
                   mode: 'markers',
                   marker:{
                     size: samples,
                     color: otu_ids,

                   }
                 };
                 //layout for bubble plot
                 var data = [trace];
                var layout = {
                  title: "Bacteria Bubble Disribution",
                  showlegend: true,
                  height: 750,
                  width: 750
                };

                Plotly.newPlot("bubble", data, layout);
               });
             }
             //return both plots (Plot1 & Plot2)
             buildPlot1();
             buildPlot2();
     
      }


    //@TODO: Build a Bubble Chart using the sample data

    //@TODO: Build a Pie Chart
    //HINT: You will need to use slice() to grab the top 10 sample_values,
    //otu_ids, and labels (10 each).



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
