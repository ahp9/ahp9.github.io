document.addEventListener("DOMContentLoaded", function () {
  d3.csv("/assets/data/alcohol_sales.csv").then(function (data) {
    data.forEach((d) => {
      d.year = +d.year;
      d.sellVodka = +d.sellVodka;
      d.sellBeer = +d.sellBeer;
      d.sellVina = +d.sellVina;
      d.sellConjac = +d.sellConjac;
      d.sellChampagne = +d.sellChampagne;
    });

    const salesByYear = d3
      .rollups(
        data,
        (v) => ({
          vodka: d3.sum(v, (d) => d.sellVodka),
          beer: d3.sum(v, (d) => d.sellBeer),
          vina: d3.sum(v, (d) => d.sellVina),
          conjac: d3.sum(v, (d) => d.sellConjac),
          champagne: d3.sum(v, (d) => d.sellChampagne),
        }),
        (d) => d.year
      )
      .sort((a, b) => a[0] - b[0]); // sort by year

    const years = salesByYear.map((d) => d[0]);
    const vodka = salesByYear.map((d) => d[1].vodka);
    const beer = salesByYear.map((d) => d[1].beer);
    const vina = salesByYear.map((d) => d[1].vina);
    const conjac = salesByYear.map((d) => d[1].conjac);
    const champagne = salesByYear.map((d) => d[1].champagne);

    const traces = [
      { y: vodka, name: "Vodka" },
      { y: beer, name: "Beer" },
      { y: vina, name: "Wine" },
      { y: conjac, name: "Conjac" },
      { y: champagne, name: "Champagne" },
    ].map((trace) => ({
      x: years,
      y: trace.y,
      name: trace.name,
      stackgroup: "one",
      mode: "none",
      type: "scatter",
    }));

    const eventYears = [2006, 2010, 2012];
    const eventLabels = [
      "2006: Regional Regulations Begin",
      "2010: Anti-Alcohol Campaign",
      "2012: Excise Tax Increases",
    ];

    const shapes = eventYears.map((year, i) => ({
      type: "line",
      x0: year,
      x1: year,
      y0: 0,
      y1: 1,
      yref: "paper",
      line: {
        color: "black",
        width: 1,
        dash: "dot",
      },
    }));

    const annotations = eventYears.map((year, i) => ({
      x: year + 0.1,
      y: 0.9,
      yref: "paper",
      text: eventLabels[i],
      showarrow: false,
      textangle: -90,
      font: { size: 10 },
    }));

    const layout = {
      title: "Alcohol Sales by Type Over Time (1994–2015)",
      xaxis: { title: "Year", dtick: 2 },
      yaxis: { title: "Total Alcohol Sold", rangemode: "tozero" },
      width: 1000,
      height: 400,
      legend: { orientation: "h", y: -0.3 },
      shapes: shapes,
      annotations: annotations,
    };

    const config = {
      displayModeBar: false,
    };

    Plotly.newPlot("alcohol_sales_1998_2015", traces, layout, config);
  });
});
