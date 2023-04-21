// Newsapi key
const newsApiKey = '7f8db2da8de34462adaa794dbcbf37c3';
const weatherApiKey = 'e2f9dbb9a2f94a38be2212305232004';

// get the page element
// Get references to the form elements
const countryRadios = document.querySelectorAll('input[type="radio"]');
const newsList = document.querySelector('#news');
const weatherSection = document.querySelector('#weather');
const numNews = document.querySelector('#numNews');



// Add event listeners to the radio buttons to toggle the active class
countryRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    // Remove the active class from all labels
    document.querySelectorAll('form label').forEach(label => label.classList.remove('active'));
    // Add the active class to the parent label of the clicked radio button
    radio.closest('label').classList.add('active');
  });
});

// Add event listener to the form submission
document.querySelector('#country-form').addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  // Find the selected country radio button
  const selectedRadio = document.querySelector('input[type="radio"]:checked');
  // add number of news selection
  const num = numNews.value;

  if (selectedRadio) {
    // Retrieve the news articles and weather for the selected country
    const country = selectedRadio.value;
    const city = getCity(country);
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=${num}&apiKey=${newsApiKey}`;
    const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}&aqi=yes`;
    

    // Clear previous result from the list
    newsList.innerHTML = '';
    weatherSection.innerHTML = '';

    // Fetch the news articles
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Display the news articles
        for (var i = 0; i < data.articles.length; i++) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          const para = document.createElement('p');
          a.href = data.articles[i].url;
          a.textContent = data.articles[i].title;
          para.textContent = data.articles[i].publishedAt;
          li.appendChild(a);
          li.appendChild(para);
          newsList.appendChild(li);
        }
        
      })
      .catch(error => console.log(error));

      
    fetch(weatherUrl)
        .then((response) => response.json())
        .then((data) => {
        // Update the weather section with the current temperature and weather description
        weatherSection.innerHTML = `The current temperature in ${city}, ${data.location.country} is ${data.current.temp_c}&deg;C, with ${data.current.condition.text} weather.`;
        const image = document.createElement('img');
        image.src = data.current.condition.icon;
        weatherSection.appendChild(image);
        })
    .catch((error) => console.log(error));
  }
}

// get city from country selected
function getCity(country) {
    switch (country) {
      case 'us':
        return 'New York';
      case 'gb':
        return 'London';
      case 'au':
        return 'Canberra';
      case 'ca':
        return 'Toronto';
      case 'in':
        return 'New Delhi';
      default:
        return 'Unknown';
    }
  }

// source: https://newsapi.org/docs/get-started, 
//         https://www.weatherapi.com/docs/