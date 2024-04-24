var apiKeyInput = document.getElementById("apiKeyInput");
var apiKeyInputContainer = document.getElementById("apiKeyInputContainer");

function getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
  
  async function getApiKey() {
    let apiKey = await caches
      .match("apiKey")
      .then((response) => {
        if (response) {
          return response.json().then((data) => data.apiKey);
        }
        return null;
      })
      .catch((error) => {
        console.error("Error retrieving API Key from cache:", error);
        return null;
      });
  
    // If apiKey is not in the cache, fetch it from the server
    if (!apiKey) {
      const response = await fetch("data.json");
      const data = await response.json();
      apiKey = data.apiKey;
  
      caches
        .open("apiKeyCache")
        .then((cache) => {
          cache.put("apiKey", new Response(JSON.stringify({ apiKey: apiKey })));
        })
        .catch((error) => {
          console.error("Error saving API Key to cache:", error);
        });
    }
  
    return apiKey;
  }
  
  // apiInputKey
  function inputApi() {
    apiKeyInputContainer.classList.remove("hidden");
    linkContainer.classList.add("hidden");
    apiKeyInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        if (apiKeyInput.value.length === 32) {
          const apiKey = apiKeyInput.value;
          caches
            .open("apiKeyCache")
            .then((cache) => {
              cache.put(
                "apiKey",
                new Response(JSON.stringify({ apiKey: apiKey }))
              );
              linkContainer.classList.remove("hidden");
              apiKeyInputContainer.classList.add("hidden");
            })
            .catch((error) => {
              console.error("Error saving API Key to cache:", error);
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
      temp.textContent = `${results[0]}c ${results[1].toLowerCase()}`;
      loadingCircle.remove();
    })
    .catch((error) => {
      console.error("Error", error);
      temp.textContent = "";
      loadingCircle.remove();
    });
  