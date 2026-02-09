let map;

import { MarkerClusterer } from "@googlemaps/markerclusterer";

async function fetchAndParseData() {
  const response = await fetch("bike-racks-geocoded.csv");
  const text = await response.text();
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  const locations = lines.slice(1).map((line) => {
    const values = line.split(",");

    const street_address = values[0] + " " + values[1];
    const street_side = values[2];
    const num_racks = parseInt(values[5]);
    const lat = parseFloat(values[7]); // Latitude is in the 8th column
    const lng = parseFloat(values[8]); // Longitude is in the 9th column
    return { lat, lng, num_racks, street_address, street_side };
  });

  return locations.filter((loc) => !isNaN(loc.lat) && !isNaN(loc.lng));
}

async function initMap() {
  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12.2,
    center: { lat: 49.25965051569108, lng: -123.15116238230053 },
    mapId: "DEMO_MAP_ID",
  });
  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });

  // Create an array of alphabetical characters used to label the markers.
  // Add some markers to the map.
  const markers = locations.map((position, i) => {
    let pinGlyph;
    if (position.num_racks > 5) {
      pinGlyph = new google.maps.marker.PinElement({
        // glyphColor: "lime",
        background: "#FBBC04",
        borderColor: "black",
        scale: 0.8,
      });
    } else if (position.num_racks > 1) {
      pinGlyph = new google.maps.marker.PinElement({
        glyphColor: "black",
        borderColor: "black",
        scale: 0.8,
      });
    } else {
      pinGlyph = new google.maps.marker.PinElement({
        glyphColor: "white",
        borderColor: "black",
        scale: 0.8,
      });
    }

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      content: pinGlyph.element,
    });

    // markers can only be keyboard focusable when they have click listeners
    // open info window when marker is clicked
    marker.addListener("click", () => {
      infoWindow.setContent(
        `<h2> ${position.street_address} - ${position.num_racks} Rack${
          position.num_racks > 1 ? "s" : ""
        } Available </h2>
        <p> Street Side: ${position.street_side} </p>
        <p> Coordinates: ${position.lat}, ${position.lng} </p>`
      );
      infoWindow.open(map, marker);
    });
    return marker;
  });

  // Add a marker clusterer to manage the markers.
  new MarkerClusterer({
    map,
    markers,
    algorithmOptions: {
      radius: 130, // Increase the radius to cluster markers that are further apart.
    },
  });

  const legend = document.getElementById("legend");

  const legendElements = {
    one_rack: { name: "1 Rack", icon: "one_rack_marker.png" },
    multi_rack: { name: "2-4 Racks", icon: "multi_rack_marker.png" },
    high_rack: { name: "5+ Racks", icon: "high_capacity_rack.png" },
  };
  for (const key in legendElements) {
    const el = legendElements[key];
    const name = el.name;
    const icon = el.icon;
    const div = document.createElement("div");
    div.innerHTML =
      '<img src="' +
      icon +
      '" style = "width:50px;height:50px"> ' +
      "<span>" +
      name +
      "</span>";

    legend.appendChild(div);
  }

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
}

const locations = await fetchAndParseData();
initMap();
