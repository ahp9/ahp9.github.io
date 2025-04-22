document.addEventListener("DOMContentLoaded", function () {
  Promise.all([
    d3.csv("/assets/data/consumption_EU=100.csv"),
    d3.csv("/assets/data/PPP_EU=1.0.csv"),
  ]).then(function ([consumptionData, pppData]) {
    const countries = Object.keys(consumptionData[0]).filter(
      (d) => d !== "Year"
    );
    const years = consumptionData.map((d) => d.Year);

    const zValues = []; // 2D array [year][country] of consumption / PPP
    const yLabels = []; // Years (y-axis)

    for (let i = 0; i < years.length; i++) {
      const year = years[i];
      const row = [];

      countries.forEach((country) => {
        const consVal = parseFloat(consumptionData[i][country]);
        const pppVal = parseFloat(pppData[i][country]);

        if (!isNaN(consVal) && !isNaN(pppVal) && pppVal > 0) {
          row.push(consVal / pppVal); // Normalize: high value = high consumption relative to price
        } else {
          row.push(null);
        }
      });

      zValues.push(row);
      yLabels.push(year);
    }

    const trace = {
      z: zValues,
      x: countries,
      y: yLabels,
      type: "heatmap",
      colorscale: "YlOrRd",
      colorbar: {
        title: "Consumption / PPP",
        ticksuffix: "",
      },
      hoverongaps: false,
    };

    const layout = {
      title:
        "Heatmap of Alcohol Consumption Adjusted for Price (Consumption / PPP)",
      xaxis: { title: "Country", tickangle: 45 },
      yaxis: { title: "Year", autorange: "reversed" },
      height: 600,
      width: 1000,
    };

    Plotly.newPlot("ppp_vs_consumption", [trace], layout);
  });
});
