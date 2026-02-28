
// פונקציה להצגת נתוני מזג אוויר בדף
function renderWeather(data) {
  // הצגת טמפרטורה (מעוגל)
  document.getElementById("wTemp").textContent = Math.round(data.main.temp);

  // הצגת מצב מזג האוויר
  document.getElementById("wCond").textContent = data.weather[0].main;

  // הצגת אחוזי לחות
  document.getElementById("wHum").textContent = data.main.humidity;

  // הצגת מהירות רוח
  document.getElementById("wWind").textContent = data.wind.speed;
}


// פונקציה להצגת אטרקציות
function renderAttractions(items) {

  // קבלת האלמנט שבו יוצגו האטרקציות
  const box = document.getElementById("attractionsContent");

  // בניית HTML דינמי לכל אטרקציה
  box.innerHTML = items
    .map(
      (it) => `
      <div class="attraction-item">
        <p><strong>${it.title}</strong></p>
        <p>${it.extract}</p>
        ${it.link
          ? `<p><a href="${it.link}" target="_blank" rel="noopener">Read more</a></p>`
          : ""
        }
        <hr class="attraction-sep">
      </div>
    `
    )
    .join("");

  // הסרת הקו המפריד האחרון
  const seps = box.querySelectorAll(".attraction-sep");
  if (seps.length) seps[seps.length - 1].remove();
}


// פונקציה להצגת מלונות
function renderHotels(items) {

  // קבלת האלמנט שבו יוצגו המלונות
  const box = document.getElementById("hotelsContent");

  // יצירת HTML דינמי לכל מלון
  box.innerHTML = items
    .map(
      (it) => `
      <div class="hotel-item">
        <p><strong>${it.title}</strong></p>
        <p>${it.extract}</p>
        ${it.link
          ? `<p><a href="${it.link}" target="_blank" rel="noopener">Read more</a></p>`
          : ""
        }
        <hr class="hotel-sep">
      </div>
    `
    )
    .join("");

  // הסרת הקו האחרון
  const seps = box.querySelectorAll(".hotel-sep");
  if (seps.length) seps[seps.length - 1].remove();
}


// פונקציה להצגת מפה
function renderMap(location) {

  // קבלת אלמנט המפה
  const box = document.getElementById("mapContent");

  // פירוק קואורדינטות מהאובייקט
  const { lat, lon, displayName } = location;

  // חישוב גבולות תיבה להצגת אזור סביב העיר
  const delta = 0.05;
  const left = lon - delta;
  const right = lon + delta;
  const top = lat + delta;
  const bottom = lat - delta;

  // יצירת קישור Embed של OpenStreetMap
  const embedUrl =
    `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;

  // יצירת קישור חיצוני למפה המלאה
  const linkUrl =
    `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`;

  // הזרקת ה-HTML לתוך הדף
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