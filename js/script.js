const link = "http://api.weatherstack.com/current?access_key=650da03b0768a19750b663e15c570da5";

const root = document.querySelector('#root'),
      popup = document.querySelector('#popup'),
      textInput = document.querySelector('#text-input'),
      form = document.querySelector('#form');

let store = {
    city: 'Saratov',
    temperature: 0,
    observationTime: "00:00 AM",
    isDay: "yes",
    description: "",
    properties: {
        cloudcover: {},
        humidity: {},
        windSpeed: {},
        visibility: {},
        uvIndex: {},
        pressure: {}
    }
};

const fetchData = async () => {
    try {
        const query = localStorage.getItem("query") || store.city;
        const result = await fetch(`${link}&query=${query}`);
        const data = await result.json();

        const {
            current: {
              cloudcover,
              temperature,
              humidity,
              observation_time: observationTime,
              pressure,
              uv_index: uvIndex,
              visibility,
              is_day: isDay,
              weather_descriptions: description,
              wind_speed: windSpeed,
            },
            location: { name },
          } = data;
        
        store = {
            ...store,
            temperature,
            city: name,
            observationTime,
            isDay,
            description: description[0],
            properties: {
                cloudcover: {
                    title: 'cloudcover',
                    value: `${cloudcover} %`,
                    icon: 'icons/cloud.png'
                },
                humidity: {
                    title: 'humidity',
                    value: `${humidity} %`,
                    icon: 'icons/humidity.png'
                },
                windSpeed: {
                    title: 'windSpeed',
                    value: `${windSpeed} km/h`,
                    icon: 'icons/wind.png'
                },
                visibility: {
                    title: 'visibility',
                    value: `${visibility} %`,
                    icon: 'icons/visibility.png'
                },
                uvIndex: {
                    title: 'uvIndex',
                    value: `${uvIndex} / 100`,
                    icon: 'icons/uv-index.png'
                },
                pressure: {
                    title: 'pressure',
                    value: `${pressure} %`,
                    icon: 'icons/gauge.png'
                }
            }
        };

        renderComponent();
    } catch(err) {
        console.log(err);
    }
};

const getImage = (description) => {
    const value = description.toLowerCase();

    switch(value) {
        case "partly cloudy":
            return 'partly.png';
        case "cloud":
            return 'cloud.png';
        case "fog":
            return 'fog.png';
        case "sunny":
            return 'sunny.png';
        case "clear":
            return 'clear.png';
        default:
            return 'the.png';
    }
};

const renderProperty = (properties) => {
    return Object.values(properties)
    .map(({ title, value, icon}) => {
        return `
            <div class="property">
                <div class="property-icon">
                    <img src="./img/${icon}" alt="">
                </div>
                <div class="property-info">
                    <div class="property-info__value">${value}</div>
                    <div class="property-info__description">${title}</div>
                </div>
            </div>
        `;
    }).join("");
    
};

const markup = () => {
    const {city, description, observationTime, temperature, isDay, properties} = store;

    const containerClass = isDay == 'yes' ? 'is-day': "";
    return `
        <div class="container ${containerClass}">
            <div class="top">

                <div class="city">
                    <div class="city-subtitle">Weather Today in</div>
                    <div class="city-title" id="city">
                        <span>${city}</span>
                    </div>
                </div>

                <div class="city-info">
                    <div class="top-left">
                        <img class="icon" src="img/${getImage(description)}" alt="" />
                        <div class="description">${description}</div>
                    </div>
            
                    <div class="top-right">
                        <div class="city-info__subtitle">as of ${observationTime}</div>
                        <div class="city-info__title">${temperature}°</div>
                    </div>
                </div>
            </div>
        <div id="properties">${renderProperty(properties)}</div>
        </div>`;
};


const renderComponent = () => {
    root.innerHTML = markup();
    const city = document.querySelector('#city');
    city.addEventListener('click', togglePopupClass);
};

const togglePopupClass = () => {
    popup.classList.toggle('active');
};

const handleInput = (e) => {
    store = {
        ...store,
        city: e.target.value
    };
};

const handleSubmit = (e) => {
    e.preventDefault();
    const value = store.city;
  
    if (!value) return null;
  
    localStorage.setItem("query", value);
    fetchData();
    togglePopupClass();
  };

form.addEventListener('submit', handleSubmit);
textInput.addEventListener('input', handleInput);

fetchData();