document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("yearSlider");
  const label = document.getElementById("yearLabel");
  const playButton = document.getElementById("playButton");

  let intervalId = null;

  Promise.all([
    d3.csv("/assets/data/alcohol_sales.csv"),
    d3.json("/assets/geodata/russia.geojson"),
  ]).then(([csvData, geoData]) => {
    csvData.forEach((d) => {
      d.year = +d.year;
      d.sellVodka = +d.sellVodka;
    });

    const regionNames = geoData.features.map((d) => d.properties.name_latin);
    const allDistricts = [...new Set(csvData.map((d) => d.fedokrug_name))];

    const detailedColorScale = [
      [0.00, "#fff5f0"],
      [0.10, "#fee0d2"],
      [0.20, "#fcbba1"],
      [0.30, "#fc9272"],
      [0.40, "#fb6a4a"],
      [0.50, "#ef3b2c"],
      [0.60, "#cb181d"],
      [0.70, "#a50f15"],
      [0.80, "#82000d"],
      [0.90, "#4a0009"],
      [1.00, "#2e0005"]
    ];

    const districtYearMap = {};
    csvData.forEach(d => {
      if (!districtYearMap[d.year]) districtYearMap[d.year] = {};
      if (!districtYearMap[d.year][d.fedokrug_name]) districtYearMap[d.year][d.fedokrug_name] = [];
      districtYearMap[d.year][d.fedokrug_name].push(d.sellVodka);
    });

    const allAvgValues = [];
    for (const year in districtYearMap) {
      for (const district in districtYearMap[year]) {
        const avg = d3.mean(districtYearMap[year][district]);
        allAvgValues.push(avg);
      }
    }

    const globalZMin = d3.min(allAvgValues);
    const globalZMax = d3.max(allAvgValues);

    const drawMap = (selectedYear) => {
      label.textContent = selectedYear;

      const yearData = csvData.filter((d) => d.year === +selectedYear);

      const districtAvgs = {};
      allDistricts.forEach((district) => {
        const entries = yearData.filter((d) => d.fedokrug_name === district);
        districtAvgs[district] = d3.mean(entries, (d) => d.sellVodka);
      });

      const regionSales = new Map();
      yearData.forEach((d) => {
        regionSales.set(d.region_name.toLowerCase(), districtAvgs[d.fedokrug_name]);
      });

      const values = regionNames.map(
        (region) => regionSales.get(region.toLowerCase()) ?? null
      );

      const mapData = [
        {
          type: "choroplethmapbox",
          name: "Avg Vodka in Federal District",
          geojson: geoData,
          locations: regionNames,
          z: values,
          zmin: globalZMin,
          zmax: globalZMax,
          colorscale: detailedColorScale,
          colorbar: {
            title: "Avg Vodka Sold<br>in Federal District<br>(L/person)",
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
            text: "Average Vodka Sales by Federal District",
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

      Plotly.newPlot("vodka_sales_map", mapData, layout, {
        scrollZoom: false,
        transition: {
          duration: 500,
          easing: "cubic-in-out",
        },
      });
    };

    drawMap(+slider.value);
    slider.addEventListener("input", () => drawMap(+slider.value));

    playButton.addEventListener("click", () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        playButton.textContent = "▶ Play";
      } else {
        intervalId = setInterval(() => {
          let currentYear = +slider.value;
          slider.value = currentYear < +slider.max ? currentYear + 1 : slider.min;
          drawMap(+slider.value);
        }, 1500);
        playButton.textContent = "⏸ Pause";
      }
    });
  });
});
