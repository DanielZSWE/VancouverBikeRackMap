import pandas as pd
import requests
import numpy as np
import os
from dotenv import load_dotenv


df = pd.read_csv('bike-racks.csv', sep = ';')
load_dotenv()
api_key = os.getenv("GOOGLE_MAPS_API_KEY")
base_url = f"https://maps.googleapis.com/maps/api/geocode/json?key={api_key}&region=ca&address="



df.columns = df.columns.str.replace(' ', '_')

df_with_coordinates = df.assign(Latitude = np.NaN, Longitude = np.NaN, Full_Name = None)


for index, row in df_with_coordinates.iterrows():
    snum = row["Street_Number"]
    sname = row["Street_Name"]
    geocoding_url_i = base_url + f"{snum}+{sname},+Vancouver,+BC"
    
    response = requests.get(geocoding_url_i)
    if response.status_code == 200:
        data = response.json()
        location = data["results"][0]["geometry"]["location"]
        df_with_coordinates.at[index, "Latitude"] = location["lat"]
        df_with_coordinates.at[index, "Longitude"] = location["lng"]
        df_with_coordinates.at[index, "Full_Name"] = f"{snum} {sname}"
        
    
    

print(df_with_coordinates.head())

df_with_coordinates.to_csv('bike-racks-3-test', index = False)
            
          
        
    


