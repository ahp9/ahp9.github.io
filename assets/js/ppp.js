document.addEventListener("DOMContentLoaded", function () {
  d3.csv(
    "/assets/data/total-alcohol-consumption-per-capita-litres-of-pure-alcohol.csv"
  ).then(function (data) {
    const countries = ["Iceland", "Finland", "Ireland", "Sweden"];
    const traces = [];

    countries.forEach((country) => {
      const years = [];
      const values = [];

      data.forEach((row) => {
        if (row.Entity === country) {
          years.push(+row.Year);
          values.push(
            parseFloat(
              row[
                "Total alcohol consumption per capita (liters of pure alcohol, projected estimates, 15+ years of age)"
              ]
            )
          );
        }
      });

      traces.push({
        x: years,
        y: values,
        name: country,
        type: "scatter",
        mode: "lines+markers",
      });
    });

    const layout = {
      title: "WHO: Alcohol Consumption per Capita (15+ years)",
      width: 900,
      height: 500,
      xaxis: { title: "Year", dtick: 1 },
      yaxis: { title: "Liters per Capita (15+)" },
      legend: { orientation: "h", y: -0.3 },
    };

    Plotly.newPlot("who_alcohol_chart", traces, layout);
  });
});
