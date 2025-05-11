document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("yearSlider");
  const label = document.getElementById("yearLabel");
  const playButton = document.getElementById("playButton"); 

  let intervalId = null; 

  Promise.all([
    d3.csv("/assets/data/vodka_sold_prize_regions.csv"),
    d3.json("/assets/geodata/russia.geojson"),
  ]).then(([csvData, geoData]) => {
    csvData.forEach((d) => {
      d.year = +d.year;
      d.sellVodka = +d.sellVodka;
      d.priceVodka = +d.priceVodka;
    });

    const regionNames = geoData.features.map((d) => d.properties.name_latin);
    const allSales = csvData.map((d) => d.sellVodka).filter((d) => d != null);
    const globalMinSales = d3.min(allSales);
    const globalMaxSales = d3.max(allSales);

    const drawMap = (selectedYear) => {
      label.textContent = selectedYear;

      const yearData = csvData.filter((d) => d.year === +selectedYear);
      const salesMap = new Map(
        yearData.map((d) => [d.region.toLowerCase(), d.sellVodka])
      );

      const salesValues = regionNames.map(
        (name) => salesMap.get(name.toLowerCase()) ?? null
      );

      const mapData = [
        {
          type: "choroplethmapbox",
          name: "Vodka Sales",
          geojson: geoData,
          locations: regionNames,
          z: salesValues,
          zmin: globalMinSales,
          zmax: globalMaxSales,
          colorscale: [
            [0.0, "#ffffcc"],
            [0.08, "#ffeda0"],
            [0.16, "#fed976"],
            [0.24, "#feb24c"],
            [0.32, "#fd8d3c"],
            [0.4, "#fc4e2a"],
            [0.5, "#e31a1c"],
            [0.6, "#bd0026"],
            [0.7, "#800026"],
            [0.8, "#67001f"],
            [0.9, "#49001f"],
            [1.0, "#33001f"],
          ],
          colorbar: {
            title: "Vodka Sold<br>(L/person)",
            x: 1.02,
            y: 0.5,
            len: 0.8,
          },
          featureidkey: "properties.name_latin",
        },
      ];

      const layout = {
        mapbox: {
          domain: { x: [0, 1], y: [0, 1] },
          style: "carto-positron",
          center: { lon: 100, lat: 65 },
          zoom: 1.5,
        },
        annotations: [
          {
            text: "Vodka Sales by Region",
            x: 0.5,
            y: 1.08,
            xref: "paper",
            yref: "paper",
            showarrow: false,
            font: { size: 16 },
            align: "center",
          },
        ],
        margin: { t: 30, b: 0, l: 0, r: 0 },
        width: 1000,
        height: 400,
      };

      Plotly.newPlot("vodka_ratio_plot", mapData, layout, {
        scrollZoom: false,
      });
    };

    drawMap(+slider.value);


    // Slider
    slider.addEventListener("input", () => {
      drawMap(+slider.value);
    });

    // Play button
    playButton.addEventListener("click", () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        playButton.textContent = "▶ Play";
      } else {
        intervalId = setInterval(() => {
          let currentYear = +slider.value;
          if (currentYear < +slider.max) {
            slider.value = currentYear + 1;
          } else {
            slider.value = slider.min;
          }
          drawMap(+slider.value);
        }, 1000); 
        playButton.textContent = "⏸ Pause";
      }
    });
  });
});
