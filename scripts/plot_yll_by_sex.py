import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv("assets/data/yll_russia.csv")

filtered_df_sex = df[
    (df['measure'] == 'YLLs (Years of Life Lost)') &
    (df['age'] == 'All ages') &
    (df['cause'] != 'All causes')
].copy()

# grouping all alcohol-related causes under a single label
filtered_df_sex['cause'] = filtered_df_sex['cause'].apply(
    lambda x: 'Alcohol related disease' if 'alcohol' in x.lower() else x
)

# group by year and sex
grouped_sex = filtered_df_sex.groupby(['year', 'sex'])['val'].sum().reset_index()

# pivot by sex for plotting
pivot_sex = grouped_sex.pivot(index='year', columns='sex', values='val')

plt.figure(figsize=(10, 6))
(pivot_sex / 1e6).plot.area(colormap='tab10', linewidth=0)
plt.xlabel('Year', fontweight='bold')
plt.ylabel('Years of Life Lost', fontweight='bold')
plt.legend(title='Sex', loc='upper right')
plt.grid(True)
plt.tight_layout()
ax = plt.gca()
labels = ax.get_yticks()
ax.set_yticklabels([f'{label:.1f}M' for label in labels])
plt.savefig("assets/img/yll_russia.png", dpi=300, bbox_inches='tight')
plt.show()