document.addEventListener("DOMContentLoaded", function () {
  d3.csv("/assets/data/alcohol_sales.csv").then(function (data) {
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
        name: 'Vodka <br>Share',
        line: { color: 'red' }
      },
      {
        x: years,
        y: beerShares,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Beer <br>Share',
        line: { color: 'blue' }
      }
    ];

    const layout = {
      title: 'Average Vodka vs Beer Share Over Time',
      xaxis: { title: 'Year', dtick: 2 },
      yaxis: { title: 'Share (%)', rangemode: 'tozero' },
      width: 595,
      height: 400,
      shapes: [
        {
          type: 'rect',
          xref: 'x',
          yref: 'paper',
          x0: 2006,
          x1: 2012,
          y0: 0,
          y1: 1,
          fillcolor: 'rgba(255, 165, 0, 0.2)',
          line: { width: 0 }
        },
        {
          type: 'rect',
          xref: 'x',
          yref: 'paper',
          x0: 2012,
          x1: 2015,
          y0: 0,
          y1: 1,
          fillcolor: 'rgba(194, 133, 255, 0.2)',
          line: { width: 0 }
        }
      ],
      annotations: [
        {
          x: 2008.5,
          y: 1.05,
          xref: 'x',
          yref: 'paper',
          text: '2006 regulations',
          showarrow: false,
          font: { size: 10 },
          align: 'center',
          bgcolor: 'rgba(255,165,0,0.4)',
          borderpad: 4
        },
        {
          x: 2013.5,
          y: 1.05,
          xref: 'x',
          yref: 'paper',
          text: '2012 tax increase',
          showarrow: false,
          font: { size: 10 },
          align: 'center',
          bgcolor: 'rgba(194, 133, 255, 0.42)',
          borderpad: 4
        }
      ]
    };

    const config = {
      displayModeBar: false,
    };

    Plotly.newPlot('vodka_beer_share_plot', traces, layout, config);
  });
});
