document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("yearSlider_prize");
  const label = document.getElementById("yearLabel_prize");
  const playPauseBtn = document.getElementById("playPauseBtn");

  let animationInterval = null;
  let isPlaying = false;

  Promise.all([
    d3.csv("/assets/data/regional_price_vodka_beer.csv"),
    d3.json("/assets/geodata/russia.geojson")
  ]).then(([csvData, geoData]) => {
    // Clean and convert data
    csvData.forEach(d => {
      d.year = +d.year;
      d.alcohol_sales = +d.alcohol_sales;
    });

    const years = [...new Set(csvData.map(d => d.year))].sort((a, b) => a - b);
    slider.min = years[0] + 1;
    slider.max = years[years.length - 3];

    const drawMap = (selectedYear) => {
      label.textContent = selectedYear;

      const yearData = csvData.filter(d => d.year === +selectedYear);
      const salesMap = new Map(yearData.map(d => [d.region.toLowerCase(), d.priceVodka]));

      const region = geoData.features.map(d => d.properties.name_latin);
      const regionValues = geoData.features.map(d => {
        const regionKey = d.properties.name_latin.toLowerCase();
        return salesMap.get(regionKey) ?? null;
      });

      const mapData = [{
        type: "choroplethmapbox",
        geojson: geoData,
        locations: region,
        z: regionValues,
        colorscale: "YlOrRd",
        colorbar: { title: "Vodka prices" },
        zmin: 0,
        zmax: d3.max(csvData, d => d.priceVodka),
        featureidkey: "properties.name_latin"
      }];

      const layout = {
        mapbox: {
          style: "carto-positron",
          center: { lon: 100, lat: 65 },
          zoom: 0.75
        },
        margin: { t: 0, b: 0 },
        width: 600,
        height: 300
      };

      Plotly.newPlot("map_vodka_prizes", mapData, layout, { scrollZoom: false });
    };

    // Animation logic
    const startAnimation = () => {
      if (animationInterval) return;
      animationInterval = setInterval(() => {
        let nextYear = +slider.value + 1;
        if (nextYear > +slider.max) nextYear = +slider.min;
        slider.value = nextYear;
        drawMap(nextYear);
      }, 1000);
    };

    const stopAnimation = () => {
      clearInterval(animationInterval);
      animationInterval = null;
    };

    playPauseBtn.addEventListener("click", () => {
      isPlaying = !isPlaying;
      playPauseBtn.textContent = isPlaying ? "Pause" : "Play";
      isPlaying ? startAnimation() : stopAnimation();
    });

    slider.addEventListener("input", () => {
      stopAnimation();  // Stop autoplay when user interacts
      isPlaying = false;
      playPauseBtn.textContent = "Play";
      drawMap(slider.value);
    });

    // Initial render
    drawMap(slider.value);
  });
});
