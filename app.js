const apiKey = "AlzaSy_Hhcz-GXbQK83G9ycraeff8eNSKkaVtqK"; // Replace with your GoMaps API key
let userLat, userLon;

// Initialize the map
const map = L.map("map").setView([0, 0], 13); // Default view, updated after getting location

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Geolocation: Get the user's current location
navigator.geolocation.getCurrentPosition(
  (position) => {
    userLat = position.coords.latitude;
    userLon = position.coords.longitude;

    // Update map view to user's location
    map.setView([userLat, userLon], 13);

    // Add a marker for the user's location
    L.marker([userLat, userLon]).addTo(map).bindPopup("Your Location").openPopup();

    // Find and display nearby hospitals
    findNearestHospitals(userLat, userLon);
  },
  (error) => {
    console.error("Error getting location:", error);
    alert("Unable to retrieve your location.");
  }
);

// Fetch nearby hospitals from GoMaps API
function findNearestHospitals(lat, lon) {
  const radius = 50000; // Search radius in meters

  fetch(`https://api.gomaps.pro/nearby?lat=${lat}&lon=${lon}&radius=${radius}&type=hospital&key=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        displayHospitalsOnMap(data.results);
      } else {
        alert("No hospitals found nearby.");
      }
    })
    .catch((error) => console.error("Error fetching hospitals:", error));
}

// Display hospitals on the map
function displayHospitalsOnMap(hospitals) {
  hospitals.forEach((hospital) => {
    const { name, geometry } = hospital;
    const lat = geometry.location.lat;
    const lon = geometry.location.lng;

    // Add a marker for each hospital
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(
        `<b>${name}</b><br>
        <button onclick="openGoogleMaps(${lat}, ${lon})">Navigate</button>`
      );
  });
}

// Redirect to Google Maps for navigation
function openGoogleMaps(lat, lon) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  window.open(url, "_blank");
}
