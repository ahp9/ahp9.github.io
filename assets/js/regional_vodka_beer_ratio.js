document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("yearSlider");
    const label = document.getElementById("yearLabel");
  
    Promise.all([
      d3.csv("/assets/data/regional_sales_ratio.csv"),
      d3.json("/assets/geodata/russia.geojson")
    ]).then(([csvData, geoData]) => {
      // Convert year and alcohol_sales to numbers
      csvData.forEach(d => {
        d.year = +d.year;
        d.alcohol_sales = +d.alcohol_sales;
      });
  
      const drawMap = (selectedYear) => {
        label.textContent = selectedYear;
  
        // Filter to selected year
        const yearData = csvData.filter(d => d.year === +selectedYear);
        const salesMap = new Map(yearData.map(d => [d.region_name.toLowerCase(), d.ratio_vodka_beer]));
  
        const regionNames = geoData.features.map(d => d.properties.name_latin);
        const regionValues = geoData.features.map(d => {
          const regionKey = d.properties.name_latin.toLowerCase();
          return salesMap.get(regionKey) ?? null;  
        });
  
        const mapData = [{
          type: "choroplethmapbox",
          geojson: geoData,
          locations: regionNames,
          z: regionValues,
          colorscale: "YlOrRd",
          colorbar: { title: "Vodka vs Beer ratio" },
          zmin: 0,
          zmax: d3.max(csvData, d => d.ratio_vodka_beer),
          featureidkey: "properties.name_latin"
        }];
  
        const layout = {
          mapbox: {
            style: "carto-positron",
            center: { lon: 100, lat: 65 },
            zoom: 1.5
          },
          margin: { t: 0, b: 0 },
          width: 900,
          height: 600
        };
  
        Plotly.newPlot("map", mapData, layout, { scrollZoom: false });
      };
  
      drawMap(slider.value);
  
      slider.addEventListener("input", () => {
        drawMap(slider.value);
      });
    });
  });