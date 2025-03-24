import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const MEASUREMENT_ID = process.env.MEASUREMENT_ID;
const API_SECRET = process.env.API_SECRET;

async function getUserLocation() {
  try {
    const { data } = await axios.get('http://ip-api.com/json');
    return {
      country: data.country,
      city: data.city,
      region: data.regionName,
      lat: data.lat,
      lon: data.lon,
    };
  } catch (error) {
    console.error('Failed to fetch location', error);
    return null;
  }
}

export async function trackEvent(name: string, params = {}) {
  const location = await getUserLocation();
  const payload = {
    client_id: 'electron_app_user',
    events: [
      {
        name: 'app_start',
        params: {
          platform: process.platform,
          country: location?.country || 'Unknown',
          city: location?.city || 'Unknown',
        },
      },
    ],
  };

  await axios.post(
    `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
    payload,
  );
}
