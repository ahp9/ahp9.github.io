document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("yearSlider");
  const label = document.getElementById("yearLabel");

  Promise.all([
    d3.csv("/assets/data/vodka_sold_prize_regions.csv"),
    d3.json("/assets/geodata/russia.geojson"),
  ]).then(([csvData, geoData]) => {
    csvData.forEach((d) => {
      d.year = +d.year;
      d.sellVodka = +d.sellVodka;
      d.priceVodka = +d.priceVodka;
    });

    const drawMaps = (selectedYear) => {
      label.textContent = selectedYear;

      const yearData = csvData.filter((d) => d.year === +selectedYear);
      const salesMap = new Map(yearData.map((d) => [d.region.toLowerCase(), d.sellVodka]));
      const priceMap = new Map(yearData.map((d) => [d.region.toLowerCase(), d.priceVodka]));

      const regionNames = geoData.features.map((d) => d.properties.name_latin);
      const salesValues = regionNames.map(
        (name) => salesMap.get(name.toLowerCase()) ?? null
      );
      const priceValues = regionNames.map(
        (name) => priceMap.get(name.toLowerCase()) ?? null
      );
      const ratioValues = regionNames.map((name) => {
        const price = priceMap.get(name.toLowerCase());
        const sales = salesMap.get(name.toLowerCase());
        return price && sales ? price / sales : null;
      });

      const maxSales = d3.max(csvData, (d) => d.sellVodka);
      const maxPrice = d3.max(csvData, (d) => d.priceVodka);
      const maxRatio = d3.max(ratioValues.filter((d) => d !== null));

      const mapData = [
        {
          type: "choroplethmapbox",
          name: "Vodka Sales",
          geojson: geoData,
          locations: regionNames,
          z: salesValues,
          zmin: 0,
          zmax: maxSales,
          colorscale: "YlGnBu",
          colorbar: {
            title: "Vodka Sales",
            x: 0.45,
            y: 0.75,
            len: 0.4,
          },
          featureidkey: "properties.name_latin",
          subplot: "mapbox",
        },
        {
          type: "choroplethmapbox",
          name: "Vodka Price",
          geojson: geoData,
          locations: regionNames,
          z: priceValues,
          zmin: 0,
          zmax: maxPrice,
          colorscale: "YlOrRd",
          colorbar: {
            title: "Vodka Price",
            x: 0.95,
            y: 0.75,
            len: 0.4,
          },
          featureidkey: "properties.name_latin",
          subplot: "mapbox2",
        },
        {
          type: "choroplethmapbox",
          name: "Price-to-Sales Ratio",
          geojson: geoData,
          locations: regionNames,
          z: ratioValues,
          zmin: 0,
          zmax: maxRatio,
          colorscale: "PuOr",
          colorbar: {
            title: "Price / Sales",
            x: 1.02,
            y: 0.25,
            len: 0.4,
          },
          featureidkey: "properties.name_latin",
          subplot: "mapbox3",
        },
      ];

      const layout = {
        mapbox: {
          domain: { x: [0, 0.5], y: [0.5, 1] },
          style: "carto-positron",
          center: { lon: 100, lat: 65 },
          zoom: 0.75,
        },
        mapbox2: {
          domain: { x: [0.5, 1], y: [0.5, 1] },
          style: "carto-positron",
          center: { lon: 100, lat: 65 },
          zoom: 0.75,
        },
        mapbox3: {
          domain: { x: [0, 1], y: [0, 0.5] },
          style: "carto-positron",
          center: { lon: 100, lat: 65 },
          zoom: 0.75,
        },
        annotations: [
          {
            text: "Vodka Sales by Region",
            x: 0.25,
            y: 1.05,
            xref: "paper",
            yref: "paper",
            showarrow: false,
            font: { size: 16 },
            align: "center",
          },
          {
            text: "Vodka Price by Region",
            x: 0.75,
            y: 1.05,
            xref: "paper",
            yref: "paper",
            showarrow: false,
            font: { size: 16 },
            align: "center",
          },
          {
            text: "Price-to-Sales Ratio",
            x: 0.5,
            y: 0.52,
            xref: "paper",
            yref: "paper",
            showarrow: false,
            font: { size: 16 },
            align: "center",
          },
        ],
        margin: { t: 20, b: 0, l: 0, r: 0 },
        width: 1200,
        height: 700,
      };

      Plotly.newPlot("map_sales_vs_price", mapData, layout, {
        scrollZoom: false,
      });
    };

    drawMaps(+slider.value);
    slider.addEventListener("input", () => {
      drawMaps(+slider.value);
    });
  });
});


