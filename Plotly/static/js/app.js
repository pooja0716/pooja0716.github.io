// Use D3 library to read samples.json file

function init() {
    d3.json("samples.json").then((data) => {

        // now adding data to dropdown menu

        var DropdownMenu = d3.select("#selDataset");
        var mNames = data.names;
        mNames.forEach((name) => {
              var mNames = DropdownMenu.append("option")
                           .attr("value", name)
                           .text(name);
        })

        // Now create a Horizontal bar chart

        var values = data.samples[0].sample_values;

        // use otu_ids as a label for this chart

        var labels = data.samples[0].otu_ids;

        // use otu_labels as the hovertext

        var hovertext = data.samples[0].otu_labels;

        var top_10Values = values.slice(0,10).reverse();
        var top_10Labels = labels.slice(0,10).reverse();
        var top_10Hovertext = hovertext.slice(0,10).reverse();
        var barChartDiv = d3.select("#bar");

        var trace1 = {
            y: top_10Labels.map(Object => "OTU " + Object),
            x: top_10Values,
            text: top_10Hovertext,
            type: "bar",
            orientation: "h"

        };


        var layout = {
            margin: {
                t: 20,
                b: 20
            }
        };

        var barchartData = [trace1]

        Plotly.newPlot("bar", barchartData, layout);

        // create a bubble chart

        var trace2 = {
            x: labels,
            y: values,
            text: hovertext,
            mode: "markers",

            marker: {
                size: values,
                color: labels,
            }
        }

        var BubbleData = [trace2];

        var layoutBubble = {
            xaxis: {title: "OTU ID"},
        }

        Plotly.newPlot("bubble", BubbleData, layoutBubble);

        var sampleMetadata = d3.select("#sample-metadata");
        var FirstName = data.metadata[0];

        // display key-value pair

        Object.entries(FirstName).forEach(([key, value]) => {
            sampleMetadata.append("p").text(`${key}: ${value}`);

        })
    });
}

// Update plots and metadata 

function optionChanged(selectValue) {
    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        var newSample = samples.filter(sample => sample.id === selectValue);
        var values = newSample[0].sample_values;
        var labels = newSample[0].otu_ids;
        var hovertext = newSample[0].otu_labels;
        var top_10Values = values.slice(0,10).reverse();
        var top_10Labels = labels.slice(0,10).reverse();
        var top_10Hovertext = hovertext.slice(0,10).reverse();

        var barChartDiv = d3.select("#bar");

        // now using restyle for update barchart

        Plotly.restyle("bar", "y", [top_10Labels.map(Object => "OTU " + Object)]);
        Plotly.restyle("bar", "x", [top_10Values]);
        Plotly.restyle("bar", "text", [top_10Hovertext]);

        // Update values for Bubblechart

        Plotly.restyle("bubble", "x", [labels]);
        Plotly.restyle("bubble", "y", [values]);
        Plotly.restyle("bubble", "size", [values]);
        Plotly.restyle("bubble", "text", [hovertext]);
        Plotly.restyle("bubble", "color", [labels]);

        var sampleMetadata = d3.select("#sample-metadata");
        sampleMetadata.html("");
        var Demographics = data.metadata;
        var newMetaData = Demographics.filter(sample => sample.id === parseInt(selectValue));

        Object.entries(newMetaData[0]).forEach(([key, value]) => {
            sampleMetadata.append("p").text(`${key}: ${value}`);
        })
    });
}
 
init();
