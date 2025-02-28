let map;
let PopUp = false;
let mapElement = document.getElementById("map");
let currentLat;
let currentLong;
let currentPage;

getLocation();

function makeMap(latitude, longitude) {
  map = L.map("map").setView([latitude, longitude], 13);
  map.on("click", onMapClick);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

function onMapClick(e) {
  console.log(e.latlng);
  let myContent = `<p>Gem denne placering.</p><button onClick="MapPopupCallBack(${e.latlng.lat}, ${e.latlng.lng})">ok</button>`;
  PopUp = L.popup(e.latlng, { content: myContent }).openOn(map);
}

function moveMapToMarker(latitude, longitude) {
  map.setView([latitude, longitude], 13);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionSuccess);
  } else {
    console.error("Geolocation is not supported");
  }
}

function positionSuccess(position) {
  currentLat = position.coords.latitude;
  currentLong = position.coords.longitude;
  getPollenData(currentLat, currentLong);
}

function getPollenData(latitude, longitude) {
  getLocationName(latitude, longitude);
  let myUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=alder_pollen,birch_pollen,grass_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,ragweed_pollen&timezone=Europe%2FBerlin&domains=cams_europe`;

  fetch(myUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      PollenDataReceived(data);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function getLocationName(lat, long) {
  fetch(
    `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=65fb5ea644244903025253axe09afbb`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.display_name);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function navCallBack(myNavItem) {
  switch (myNavItem) {
    case "map":
      console.log("map");
      makeMap(currentLat, currentLong);
      break;
    case "settings":
    case "home":
      console.log(myNavItem);
      if (map) map.remove();
      break;
    default:
      break;
  }
}

function MapPopupCallBack(lat, lng) {
  console.log("pop up");
  if (map) map.closePopup(PopUp);
  PopUp = false;
  L.marker([lat, lng]).addTo(map).bindPopup("Saved Location");
  getPollenData(lat, lng);
}

function PollenDataReceived(data) {
  console.log(data);
}
