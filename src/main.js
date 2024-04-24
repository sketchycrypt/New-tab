var searchBox = document.getElementById("text_box");
var searchButton = document.getElementById("searchbutton");
var temp = document.getElementById("temperature");
const savedTheme = localStorage.getItem("theme");
var body = document.getElementById("body");
var darkmodeButton = document.getElementById("darkModeBtn");
var loadingCircle = document.getElementById("loadingCircle");

var linkContainer = document.getElementById("link-container");

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

  var time = "| " + h + ":" + m + " ";
  document.getElementById("clock").innerText = time;

  setTimeout(showTime, 1000);
}

showTime();
