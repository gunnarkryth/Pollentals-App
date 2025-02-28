// write cool JS hwere!!

let map
let PopUp = false;

let mapElement = document.getElementById('map')

let currentLat
let currentLong

let currentPage


getLocation();

/* function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(GetAll);
   
  } else {
    document.getElementById("demo").innerHTML = "Geolocation is not supported";
  }
}


 async function GetAll(position) {




    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    makeMap(latitude, longitude)

    let myUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=alder_pollen,birch_pollen,grass_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,ragweed_pollen&timezone=Europe%2FBerlin&domains=cams_europe`;

    let geoUrl=`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=65fb5ea644244903025253axe09afbb`

  try {
    const res = await Promise.all([
      fetch(myUrl),
      fetch(geoUrl)
    ]);
    const data = await Promise.all(res.map(r => r.json()))

    console.log(data[0]);
    console.log(data[1]);

  } catch {
    throw Error("Promise failed");
  }
}; */




function makeMap(latitude, longitude) {

  map = L.map('map').setView([latitude, longitude], 13);

  //var marker = L.marker([latitude, longitude]).addTo(map);
  map.on('click', onMapClick);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}



function onMapClick(e) {

  //moveMapToMarker(10,10);

  console.log(e.latlng);




  let myContent = `<P>Gem denne placering.</p><button onClick="MapPopupCallBack(${e.latlng.lat},${e.latlng.lng})">ok</button>`
  PopUp = L.popup(e.latlng, { content: myContent }).openOn(map);

  /* var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
  getPollenData(e.latlng.lat,e.latlng.lng)  */
}


function moveMapToMarker(latitude, longitude) {
  map.setView([latitude, longitude], 13);
}




function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionSucces);

  } else {
    document.getElementById("demo").innerHTML = "Geolocation is not supported";
  }
}



function positionSucces(position) {
  currentLat = position.coords.latitude
  currentLong = position.coords.longitude

  // makeMap(currentLat, currentLong);
  getPollenData(position.coords.latitude, position.coords.longitude)

}


function getPollenData(latitude, longitude) {


  /* console.log("get pollen data: "+position);
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude; */

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
      // Handle the data
      //console.log(data);
      PollenDataRecieved(data)
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      console.error("Fetch error:", error);
    });
}


function getLocationName(lat, long) {




  fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=65fb5ea644244903025253axe09afbb`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data
      console.log(data.display_name);
      //console.log(data.address.hamlet+' '+data.address.village);

    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      console.error("Fetch error:", error);
    });


}

removeMap(){


}


function navCallBack(myNavItem) {

  switch (myNavItem) {
    case "map":
      console.log("map");
      makeMap(currentLat, currentLong);
      break;
    case "settings":
      console.log("settings");
      map.remove()
      break;
    case "home":
      console.log("home");
      map.remove()
      break;
    default:

      break;
  }

}

function MapPopupCallBack(lat, lng) {
  console.log("pop up");
  map.closePopup(PopUp)
  PopUp = false;

  var marker = L.marker([lat, lng]).addTo(map).bindPopup("Saved Location");
  getPollenData(lat, lng)

}

function PollenDataRecieved(data) {

  console.log(data);

}