import axios from "axios";

export async function getEmbedGoogleMapsUrl(originalUrl: string): Promise<string | null> {
  try {
    // Resolve redirects for short URLs (e.g., maps.app.goo.gl)
    const response = await axios.get(originalUrl, {
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const finalUrl = response.request.res.responseUrl || response.config.url;

    // Case 1: URL has coordinates like @lat,lng
    const coordsMatch = finalUrl.match(/@([-0-9.]+),([-0-9.]+)/);
    if (coordsMatch) {
      const [, lat, lng] = coordsMatch;
      return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
    }

    // Case 2: Place name in URL
    const placeMatch = finalUrl.match(/\/place\/([^/?]+)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
      return `https://www.google.com/maps?q=${placeName}&output=embed`;
    }

    // Case 3: Already a Google Maps URL
    if (finalUrl.includes("google.com/maps")) {
      return finalUrl.includes("output=embed")
        ? finalUrl
        : finalUrl + "&output=embed";
    }

    return null;
  } catch (err) {
    console.error("Error resolving Google Maps link:", err);
    return null;
  }
}