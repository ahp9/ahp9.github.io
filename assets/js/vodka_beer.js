document.addEventListener("DOMContentLoaded", function () {
  d3.csv("/assets/data/filtered_regional_data.csv").then(function (data) {
    // Clean and parse data
    data.forEach(d => {
      d.year = +d.year;
      d.ratio_vodka_beer = parseFloat(d.ratio_vodka_beer);
    });

    // Group by year and average ratio
    const grouped = d3.rollups(
      data.filter(d => !isNaN(d.ratio_vodka_beer)),
      v => d3.mean(v, d => d.ratio_vodka_beer),
      d => d.year
    ).sort((a, b) => a[0] - b[0]);

    const years = grouped.map(d => d[0]);
    const avgRatios = grouped.map(d => d[1]);

    const trace = {
      x: years,
      y: avgRatios,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Vodka-to-Beer Ratio',
      line: { shape: 'linear' }
    };

    const layout = {
      title: 'Average Vodka-to-Beer Ratio Over Time',
      xaxis: { title: 'Year', dtick: 2 },
      yaxis: { title: 'Vodka / Beer Ratio', rangemode: 'tozero' },
      width: 900,
      height: 500
    };

    Plotly.newPlot('vodka_beer_ratio_plot', [trace], layout);
  });
});