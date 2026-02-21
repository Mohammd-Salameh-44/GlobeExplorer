function renderWeather(data) {
  document.getElementById("wTemp").textContent = Math.round(data.main.temp);
  document.getElementById("wCond").textContent = data.weather[0].main;
  document.getElementById("wHum").textContent = data.main.humidity;
  document.getElementById("wWind").textContent = data.wind.speed;
}

function renderAttractions(items) {
  const box = document.getElementById("attractionsContent");

  box.innerHTML = items
    .map(
      (it) => `
      <div class="attraction-item">
        <p><strong>${it.title}</strong></p>
        <p>${it.extract}</p>
        ${
          it.link
            ? `<p><a href="${it.link}" target="_blank" rel="noopener">Read more</a></p>`
            : ""
        }
        <hr class="attraction-sep">
      </div>
    `
    )
    .join("");

  const seps = box.querySelectorAll(".attraction-sep");
  if (seps.length) seps[seps.length - 1].remove();
}

function renderHotels(items) {
  const box = document.getElementById("hotelsContent");

  box.innerHTML = items
    .map(
      (it) => `
      <div class="hotel-item">
        <p><strong>${it.title}</strong></p>
        <p>${it.extract}</p>
        ${
          it.link
            ? `<p><a href="${it.link}" target="_blank" rel="noopener">Read more</a></p>`
            : ""
        }
        <hr class="hotel-sep">
      </div>
    `
    )
    .join("");

  const seps = box.querySelectorAll(".hotel-sep");
  if (seps.length) seps[seps.length - 1].remove();
}

function renderMap(location) {
  const box = document.getElementById("mapContent");
  const { lat, lon, displayName } = location;

  const delta = 0.05; 
  const left = lon - delta;
  const right = lon + delta;
  const top = lat + delta;
  const bottom = lat - delta;

  const embedUrl =
    `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;

  const linkUrl =
    `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`;

  box.innerHTML = `
    <p><strong>${displayName}</strong></p>
    <iframe
      title="map"
      src="${embedUrl}"
      width="100%"
      height="300"
      style="border:0; border-radius:12px;"
      loading="lazy"
    ></iframe>
    <p><a href="${linkUrl}" target="_blank" rel="noopener">Open in OpenStreetMap</a></p>
  `;
}