var searchBox = document.getElementById("text_box");
var searchButton = document.getElementById("searchbutton");
var temp = document.getElementById("temperature");
var savedTheme = localStorage.getItem("theme");
var body = document.getElementById("body");
var darkmodeButton = document.getElementById("darkModeBtn");
var loadingCircle = document.getElementById("loadingCircle");

var apiKeyInput = document.getElementById("apiKeyInput")
var apiKeyInputContainer = document.getElementById("apiKeyInputContainer")
var linkContainer = document.getElementById('link-container')

searchBox.focus();

// themeing

if (savedTheme) {
  body.classList.add(savedTheme);
}

darkmodeButton.addEventListener("click", function () {
  body.classList.toggle("dark");
  const currentTheme = body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", currentTheme);
});

// search

searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (searchBox.value === "") {
      return;
    } else {
      windowRedirect();
    }
  }
});
searchButton.addEventListener("click", (event) => {
  if (searchBox.value === "") {
    return;
  } else {
    windowRedirect();
  }
});

// APICALL / LOCATION

function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function getApiKey() {
  let apiKey = await caches.match('apiKey').then(response => {
     if (response) {
       return response.json().then(data => data.apiKey);
     }
     return null;
  }).catch(error => {
     console.error('Error retrieving API Key from cache:', error);
     return null;
  });
 
  // If apiKey is not in the cache, fetch it from the server
  if (!apiKey) {
     const response = await fetch('data.json');
     const data = await response.json();
     apiKey = data.apiKey;
 
     caches.open('apiKeyCache').then(cache => {
       cache.put('apiKey', new Response(JSON.stringify({ apiKey: apiKey })));
     }).catch(error => {
       console.error('Error saving API Key to cache:', error);
     });
  }
 
  return apiKey;
 }
 

// apiInputKey
function inputApi() {
  apiKeyInputContainer.classList.remove('hidden');
  linkContainer.classList.add('hidden');
  apiKeyInput.addEventListener("keydown", (event) => {
     if (event.key === 'Enter') {
       if (apiKeyInput.value.length === 32) {
         const apiKey = apiKeyInput.value;
         caches.open('apiKeyCache').then((cache) => {
           cache.put('apiKey', new Response(JSON.stringify({ apiKey: apiKey })));
           linkContainer.classList.remove('hidden');
           apiKeyInputContainer.classList.add('hidden');
         }).catch((error) => {
           console.error('Error saving API Key to cache:', error);
         });
       } else {
         alert("Not long enough");
       }
     }
  });
 }
 

async function apiCall(latitude, longitude, apiKey) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&&appid=${apiKey}`
    );
    if (!response.ok) {
      throw new Error("Network error");
    }
    const json = await response.json();
    data = json;
    var tempCelcius = Math.ceil(data.main.temp - 273);
    var status = data.weather[0].main;

    var results = [tempCelcius, status];
    return results;
  } catch (error) {
    console.error("error");
  }
}

getLocation()
  .then(async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const apiKey = await getApiKey();
    return { latitude, longitude, apiKey };
  })
  .then(({ latitude, longitude, apiKey }) =>
    apiCall(latitude, longitude, apiKey)
  )
  .then((results) => {
    temp.textContent = `${results[0]} celcius // ${results[1].toLowerCase()}`;
    loadingCircle.remove();
  })
  .catch((error) => {
    console.error("Error", error);
    temp.textContent = "";
    loadingCircle.remove();
  });

// window redirect

async function windowRedirect() {
  var input = searchBox.value.trim().toLowerCase();
  const response = await fetch("keywords.json");
  const data = await response.json();
  const keywords = data.keywords;

  var foundExactKeyword = keywords.find((keyword) =>
    keyword.toLowerCase() == input
  );

  if (foundExactKeyword) {
    window.location.replace(`https://${foundExactKeyword}.com`);
  } else {
    window.location.replace(
      `https://www.google.com/search?q=${encodeURIComponent(searchBox.value)}`
    );
  }
}

// time

function showTime() {
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes();

  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;

  var time = "  | time : " + h + ":" + m + " ";
  document.getElementById("clock").innerText = time;

  setTimeout(showTime, 1000);
}

showTime();
