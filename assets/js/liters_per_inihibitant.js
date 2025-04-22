document.addEventListener("DOMContentLoaded", function () {
  d3.csv("assets/data/liters_per_inhibitant.csv").then(function (data) {
    // Convert relevant fields to numbers and ignore "." placeholders
    const years = [];
    const total = [];
    const beer = [];
    const wine = [];
    const spirits = [];

    data.forEach((row) => {
      years.push(row.Year);
      total.push(parseFloat(row.Total));
      beer.push(row.Beer === "." ? null : parseFloat(row.Beer));
      wine.push(row.Wine === "." ? null : parseFloat(row.Wine));
      spirits.push(row.Spirits === "." ? null : parseFloat(row.Spirits));
    });

    const traces = [
      {
        x: years,
        y: total,
        name: "Total",
        type: "scatter",
        mode: "lines+markers",
      },
      {
        x: years,
        y: beer,
        name: "Beer",
        type: "scatter",
        mode: "lines+markers",
      },
      {
        x: years,
        y: wine,
        name: "Wine",
        type: "scatter",
        mode: "lines+markers",
      },
      {
        x: years,
        y: spirits,
        name: "Spirits",
        type: "scatter",
        mode: "lines+markers",
      },
    ];

    const layout = {
      title: "Alcohol Consumption per Inhabitant Over Time",
      width: 800,
      height: 500,
      xaxis: { title: "Year" },
      yaxis: { title: "Liters" },
      legend: { orientation: "h", y: -0.3 },
    };

    Plotly.newPlot("liters_per_inihibitant", traces, layout);
  });
});
