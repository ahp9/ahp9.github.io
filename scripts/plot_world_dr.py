import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv("assets/data/death-rate_countries.csv")

# Group by country and year, sum all death numbers (all causes)
df_grouped = df.groupby(['location', 'year'])['val'].sum().reset_index()

df_grouped['location'] = df_grouped['location'].replace({
    'Russian Federation': 'Russia',
})

# Plot
plt.figure(figsize=(9, 5))
sns.lineplot(data=df_grouped, x='year', y='val', hue='location', marker='o')
plt.xlabel("Year", fontweight='bold')
plt.ylabel("Deaths per 100,000 individuals", fontweight='bold')
plt.grid(True)
plt.xticks(rotation=45)
plt.tight_layout()
plt.legend(title='Country')
plt.savefig("assets/img/death_rate_by_country.png", dpi=300, bbox_inches='tight')
plt.show()
