const link = "http://api.weatherstack.com/current?access_key=650da03b0768a19750b663e15c570da5";

const root = document.querySelector('#root');

let store = {
    city: 'Saratov',
    feelslike: 0,
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
    const result = await fetch(`${link}&query=${store.city}`),
          data = await result.json();

    const { 
        current: {
            feelslike, 
            cloudcover, 
            temperature, 
            humidity,
            observation_time: observationTime,
            pressure,
            uv_index: uvIndex,
            visibility,
            is_day: isDay,
            weather_descriptions: description,
            wind_speed: windSpeed
        } 
    } = data;
    
    store = {
        ...store,
        feelslike,
        temperature,
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
};

fetchData();