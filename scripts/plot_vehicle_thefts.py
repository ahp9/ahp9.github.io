import pandas as pd
import matplotlib.pyplot as plt

# Load dataset
df = pd.read_csv("data/crime_data.csv")

# Filter for Vehicle Theft only
vehicle_thefts = df[df["Category"].str.upper() == "VEHICLE THEFT"]

# Group by month and count
monthly_counts = vehicle_thefts.groupby("Month").size().sort_index()

# Plot
plt.figure(figsize=(10, 5))
monthly_counts.plot(kind="bar", color="#007acc")
plt.title("Vehicle Thefts per Month")
plt.xlabel("Month")
plt.ylabel("Number of Thefts")
plt.xticks(rotation=45)
plt.tight_layout()

# Save to assets
plt.savefig("assets/img/vehicle_thefts_by_month.png")
print("Plot saved to assets/img/vehicle_thefts_by_month.png")
