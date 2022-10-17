const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  enterButton = inputPart.querySelector('.location-loader'),
  locationBtn = inputPart.querySelector("button"),
  weatherIcon = document.querySelector(".weather-part img"),
  arrowBack = wrapper.querySelector("header i");
let api;


inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

enterButton.addEventListener("click", () =>{ 
    requestApi(inputField.value)
})



locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation api");
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

apiKey = "b21c4b237a9ce5e59e747cfbe70c2e26";

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting Weather Details...";
  infoTxt.classList.add("pending");

  fetch(api).then((response) =>
    response.json().then((result) => weatherDetails(result))
  );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    infoTxt.classList.replace("pending", "error");
  } else {
    const city = info.name,
      // pic = info.weather[0].icon,
      country = info.sys.country,
      { description, id } = info.weather[0],
      { feels_like, humidity, temp } = info.main;

    if (id == 800) {
      weatherIcon.src = "gif/clear.gif";
    } else if (id >= 200 && id <= 232) {
      weatherIcon.src = "gif/storm.gif";
    } else if (id >= 600 && id <= 622) {
      weatherIcon.src = "gif/snow.gif";
    } else if (id >= 701 && id <= 781) {
      weatherIcon.src = "gif/haze.gif";
    } else if (id >= 801 && id <= 804) {
      weatherIcon.src = "gif/cloudy.gif";
    } else if (id >= 300 && id <= 321) {
      weatherIcon.src = "gif/rain.gif";
    }

    //   weatherIcon.src = `http://openweathermap.org/img/wn/${pic}@4x.png`

    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText =
      capitalizeFirstLetter(description);
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
}



function arrowback() {
  arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
    inputField.value = "";
  });
}
arrowback();

document.addEventListener("keydown", (event) => {
  let name = event.key;
  let code = event.code;
  if (name == "Enter") {
    document.getElementById("input").focus();
  }
  
  if (code == "Escape" || code == "ArrowLeft") {
    wrapper.classList.remove("active");
    inputField.value = "";
    }
  })