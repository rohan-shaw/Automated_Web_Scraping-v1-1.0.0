const axios = require('axios');

// ? -------------------------------- /urls -----------------------------------------------------

// Replace with the URL of the API server
const apiURL = 'http://localhost:4000/urls';

// Define the starting URL
const startingURL = 'https://lumaticai.com';

// Send a GET request to retrieve URLs
axios.get(apiURL, { params: { url: startingURL } })
  .then((response) => {
    const urls = response.data;
    console.log("List of URLs:");
    urls.forEach((url) => {
      console.log(url);
    });
  })
  .catch((error) => {
    console.error(`Failed to retrieve URLs: ${error.message}`);
  });


// ? -------------------------------- /scrape -----------------------------------------------------


// Replace with the URL of the API server
const apiURL2 = 'http://localhost:4000/scrape';

// Define the list of URLs to scrape
const urlsToScrape = [
    'https://lumaticai.com/',
    'https://aviqai.com'
    // 'https://lumaticai.com/services/',
];

// Create a JSON payload
const payload = { urls: urlsToScrape };

// Send a POST request to scrape data
axios.post(apiURL2, payload)
  .then((response) => {
    const scrapedData = response.data;
    console.log("Scraped Data:");
    scrapedData.forEach((data) => {
      console.log(`URL: ${data.url}`);
      console.log(`Title: ${data.title}`);
      console.log(`Content: ${data.data}`);
      console.log();
    });
  })
  .catch((error) => {
    console.error(`Failed to scrape data: ${error.message}`);
  });
