export async function getCoordsFromAddress(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY; 
  
  // Kodujemy adres, aby był bezpieczny w URL
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      // Wyciągamy lat i lng z pierwszego wyniku
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }
    
    return null;
  } catch (error) {
    console.error("Geocoding Error:", error);
    return null;
  }
}