document.addEventListener("DOMContentLoaded", function () {
  d3.csv("/assets/data/alcohol_prices_regional_data_level.csv").then(function (data) {
    // Parse numbers
    data.forEach((d) => {
      d.year = +d.year;
      d.priceVodka = parseFloat(d.priceVodka);
      d.pricePivo_rus = parseFloat(d.pricePivo_rus);
      d.pricePivo_for = parseFloat(d.pricePivo_for);
    });

    // Group by year and compute average prices
    let grouped = d3.rollups(
      data,
      (v) => ({
        vodka: d3.mean(v, (d) => d.priceVodka),
        beer_rus: d3.mean(v, (d) => d.pricePivo_rus),
        beer_for: d3.mean(v, (d) => d.pricePivo_for),
      }),
      (d) => d.year
    );

    // Sort by year
    grouped.sort((a, b) => a[0] - b[0]);

    // Filter out any years with missing data in any series
    grouped = grouped.filter(
      (d) =>
        d[1].vodka != null &&
        !isNaN(d[1].vodka) &&
        d[1].beer_rus != null &&
        !isNaN(d[1].beer_rus) &&
        d[1].beer_for != null &&
        !isNaN(d[1].beer_for)
    );

    // Prepare arrays
    const years = grouped.map((d) => d[0]);
    const vodkaPrices = grouped.map((d) => d[1].vodka);
    const beerRusPrices = grouped.map((d) => d[1].beer_rus);
    const beerForPrices = grouped.map((d) => d[1].beer_for);

    // Plot traces
    const traces = [
      {
        x: years,
        y: vodkaPrices,
        type: "scatter",
        mode: "lines+markers",
        name: "Vodka <br>Price",
      },
      {
        x: years,
        y: beerRusPrices,
        type: "scatter",
        mode: "lines+markers",
        name: "Russian <br>Beer Price",
      },
      {
        x: years,
        y: beerForPrices,
        type: "scatter",
        mode: "lines+markers",
        name: "Foreign <br>Beer Price",
      },
    ];

    const layout = {
      title: "Average Alcohol Prices Across Russia Over Time",
      xaxis: { title: "Year", dtick: 2 },
      yaxis: { title: "Average Price (Rubles)", rangemode: "tozero" },
      width: 595,
      height: 400,
    };

    const config = {
        displayModeBar: false,
    }

    Plotly.newPlot("vodka_beer_price_plot", traces, layout, config);
  });
});
