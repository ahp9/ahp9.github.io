document.addEventListener("DOMContentLoaded", function () {
  d3.csv("/assets/data/vodka_vs_beer.csv").then(function (data) {
    // Parse numbers
    data.forEach(d => {
      d.year = +d.year;
      d.vodka_share = parseFloat(d.vodka_share);
      d.beer_share = parseFloat(d.beer_share);
    });

    // Group by year and average both shares
    const grouped = d3.rollups(
      data,
      v => ({
        vodka: d3.mean(v, d => d.vodka_share),
        beer: d3.mean(v, d => d.beer_share)
      }),
      d => d.year
    ).sort((a, b) => a[0] - b[0]);

    const years = grouped.map(d => d[0]);
    const vodkaShares = grouped.map(d => d[1].vodka);
    const beerShares = grouped.map(d => d[1].beer);

    const traces = [
      {
        x: years,
        y: vodkaShares,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Vodka Share'
      },
      {
        x: years,
        y: beerShares,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Beer Share'
      }
    ];

    const layout = {
      title: 'Average Vodka vs Beer Share Over Time',
      xaxis: { title: 'Year', dtick: 2 },
      yaxis: { title: 'Share (%)', rangemode: 'tozero' },
      width: 900,
      height: 500
    };

    Plotly.newPlot('vodka_beer_share_plot', traces, layout);
  });
});