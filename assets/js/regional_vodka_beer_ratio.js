d3.csv("/assets/data/vodka_sold_prize_regions.csv").then((df) => {
  // Convert numeric fields
  df.forEach((d) => {
    d.year = +d.year;
    d.sellVodka = +d.sellVodka;
    d.priceVodka = +d.priceVodka;
  });

  // Debug suspicious ratios in 2007
  const year = 2007;
  const data2007 = df.filter((d) => d.year === year);

  // Print each region’s data
  data2007.forEach((d) => {
    const price = d.priceVodka;
    const sales = d.sellVodka;
    const ratio = sales ? sales / price : null;

    console.log(
      `Region: ${d.region}, Price: ${price}, Sales: ${sales}, Ratio: ${ratio}`
    );
  });

  // Optional: Top 10 highest ratios
  const topRatios = [...data2007]
    .map((d) => ({
      region: d.region,
      price: d.priceVodka,
      sales: d.sellVodka,
      ratio: d.sellVodka ? d.priceVodka / d.sellVodka : null,
    }))
    .sort((a, b) => b.ratio - a.ratio);

  console.table(topRatios.slice(0, 10));
});
