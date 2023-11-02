//opens countries url
function fetchF(URL, num) {
    fetch(URL)
    .then(function(response){
        return response.json();
    })

    .then(function(resp) {
        console.log(resp);
        switch (num) {
            case 1:
                countriesSelect(resp.data);
                return resp;
    
            case 2:
                citiesSelect(resp.data);
                return resp;
    
            case 3:
                cityTmp(resp);
                return resp;
    
            case 4:
                builtRes(resp.dataseries);
                return resp;
    
            default:
                break;
        }

    })
    
    .catch(function(error) {
        if(num == 2)
            printGif();
        else
            console.log(error);
    });

}

function getCountries() {
    let countriesURL = "https://countriesnow.space/api/v0.1/countries/info?returns=flag";

    fetchF(countriesURL, 1);
}


//builds the cities select
function countriesSelect(arr) {
    console.log(arr);
    arr.sort((a, b) => a.name.localeCompare(b.name));
    const selc = document.querySelector("#countrySelect");
    arr.forEach((item) => {
        let opt = document.createElement("option");
        opt.value = item.name;
        opt.innerText = item.name;
        selc.appendChild(opt);
    });
    selc.addEventListener("change", getCities);
}

//opens the cities url of the matching country
function getCities(event) {
    const res = document.querySelector('#forecastTable');
    res.innerHTML = '';
    const title = document.querySelector('#title');
    title.innerText= " ";

    let citiesUrl = "https://countriesnow.space/api/v0.1/countries/cities/q?country=";
    const selectedCity = event.target.value;
    console.log(selectedCity);
    citiesUrl += selectedCity.replace(' ', '%20');

    const selc = document.querySelector("#citySelect");
    selc.innerHTML = "<option selected disabled>--Select a city--</option>";

    fetchF(citiesUrl, 2);
}


//builds the cities select
function citiesSelect(arr) {
    console.log(arr);
    arr.sort();

    const selc = document.querySelector("#citySelect");

    arr.forEach((item) => {
        let opt = document.createElement("option");
        opt.value = item;
        opt.innerText = item;
        selc.appendChild(opt);
    });
    selc.addEventListener("change", cityLatLon);
}


function cityLatLon () {
    let cityName = document.querySelector("#citySelect").value;
    console.log(cityName);

    let countryName = document.querySelector("#countrySelect").value;
    console.log(countryName);

    let datumPURL = `https://nominatim.openstreetmap.org/search.php?city=${cityName}&country=${countryName}&format=jsonv2`;

    //adds the updating title
    document.querySelector("#title").innerText =  " ";
    document.querySelector("#title").innerText =  `${cityName} - ${countryName}`;
    
    fetchF(datumPURL, 3);
}


function cityTmp(Cdata) {
    let lat, lon;
    if (Cdata && Cdata.length >= 1) {
        lat = Cdata[0].lat;
        console.log(lat);
        lon = Cdata[0].lon;
        console.log(lon);
        console.log(Cdata);
    } else {
        if (lat === undefined && lon === undefined) {
            printGif();
        }
        console.log(Cdata);
    }

    if (lat != undefined && lon != undefined) {
        tmpsURL = `https://www.7timer.info/bin/astro.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`;
        
        fetchF(tmpsURL, 4);
    }

}

function builtRes(tmpArr) {
    const res = document.querySelector('#forecastTable');
    res.innerHTML = '';

    tmpArr.forEach((temp) => {
        let card = document.createElement("div");
        card.id = 'card';

        let hours = document.createElement("div");
        hours.id = 'cardTitle';
        hours.innerText = "+";
        hours.innerText += temp.timepoint;
        hours.innerText += "hrs";
        card.appendChild(hours);

        let imeg = document.createElement("img");
        imeg.id = 'cardPhoto';
        imeg.src = whatPhoto(temp);
        card.appendChild(imeg);

        let tmp = document.createElement("div");
        tmp.id = 'cardTmp';
        tmp.innerText += temp.temp2m;
        tmp.innerText += " C°";
        card.appendChild(tmp);
        res.appendChild(card);
    });
}

function whatPhoto(item) {
    //cold weather
    if (item.prec_type === "rain" && item.lifted_index < -5) {
        return "storm.jpg";}
    else if (item.prec_type === "rain") {
        if ((item.cloudcover === 6 || item.cloudcover === 7))
            return "clouds with sun and rain.jpg";
        else
            return "rain.jpg";} 
    else if (item.prec_type === "snow") {
        return "snowy.jpg";} 
    else if (item.lifted_index < -5) {
        return "lightning.jpg";
    }
    //cloudy
    if (item.cloudcover > 2 && item.cloudcover < 8) {
        return "clouds with sun.jpg";
    }
    else if (item.cloudcover > 7) {
        return "cloudy.jpg";
    }
    else if (item.cloudcover < 3) {
        return "sun.jpg";
    }

}

function printGif() {
    let res = document.querySelector("#forecastTable");
    let gifD = document.createElement("div");
    gifD.style.height = "100%";
    gifD.style.width = "100%";
    gifD.style.display = "flex";
    gifD.style.flexDirection = "column";
    gifD.style.alignItems = "center";
    gifD.style.justifyContent = "center";
    let errorTitle = document.createElement("h2");
    errorTitle.innerText = "NO VALID DATA-";
    const gif = document.createElement('img');
    gif.src= "giphy.gif";
    gif.style.height = "80%";
    gif.style.width = "60%";
    gif.style.alignItems = "center";
    gifD.append(errorTitle, gif);
    res.appendChild(gifD);
} 

getCountries();