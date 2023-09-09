# Automated_Web_Scraping-v1-1.0.0

This is a high level Node.js web scraping API using Puppeteer and Express.js. It allows you to retrieve a list of URLs from a given starting URL and scrape data from each URL in the list. The scraped data includes the page title and cleaned text content. It can bypass almost any blocker.

<br/>

<div id="summary" align="center">
  <img src=https://user-images.githubusercontent.com/10379601/29446482-04f7036a-841f-11e7-9872-91d1fc2ea683.png title="TinyLlama" width=20% />
</div>

<br/>

> **Note**
> Remember this is only for educational purpose and should only be used for educational purpose.

It is built using the following technologies:

* [Node.js](https://nodejs.org/) 
* [Express](https://expressjs.com/)
* [Puppeteer](https://pptr.dev/)
* [Puppeteer-extra](https://github.com/berstend/puppeteer-extra)
* [Puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra-plugin-stealth)

## Table of Contents

- [Prerequisites](#prerequisites)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Usage](#usage)
  - [Start the server](#start-the-server)
  - [Get List of URLs](#get-list-of-urls)
    - [Using Python](#using-python)
    - [Using JavaScript (Node.js)](#using-javascript-nodejs)
  - [Scrape Data from URLs](#scrape-data-from-urls)
    - [Using Python](#using-python-1)
    - [Using JavaScript (Node.js)](#using-javascript-nodejs-1)
- [Error Handling](#error-handling)
- [CORS Configuration](#cors-configuration)
- [Dependencies](#dependencies)
- [License](#license)

## Prerequisites
Before using this API, make sure you have the following prerequisites installed:

* Node.js
* npm

## API Endpoints

Then, you can use the following endpoints to scrape data from websites:

* `/urls`: This endpoint takes a URL as a query parameter and returns a list of all the URLs on that page.
* `/scrape`: This endpoint takes a list of URLs as a request body and returns a list of objects containing the scraped data for each URL.


## Installation

1. Clone this repository to your local machine:

```
git clone https://github.com/rohan-shaw/Automated_Web_Scraping-v1-1.0.0.git
```

2. Navigate to the project directory:

```
cd Automated_Web_Scraping-v1-1.0.0
```

3. Install the required dependencies:

```
npm install
```

## Usage

Now let's see how can you use the api 😊

### Start the server

To use the web scraper, first start the server by running the following command:

```
npm start
```
- The server will listen on port 3000 by default.

## Get List of URLs

You can retrieve a list of URLs from a starting URL by making a GET request to the /urls endpoint.

* Request

```bash
GET /urls?url=https://example.com
```
Replace https://example.com with your desired starting URL.

* Response

The response will be a JSON array containing all the URLs found on the specified page.

#### Using Python

Sending GET Requests to Retrieve URLs

- To retrieve a list of URLs from a starting URL using Python, you can use the `requests` library. Here's an example of how to do it:

```python
import requests

# Replace with the URL of the API server
api_url = 'http://localhost:3000/urls'

# Define the starting URL
starting_url = 'https://example.com'

# Send a GET request to retrieve URLs
response = requests.get(api_url, params={'url': starting_url})

# Check if the request was successful
if response.status_code == 200:
    urls = response.json()
    print("List of URLs:")
    for url in urls:
        print(url)
else:
    print(f"Failed to retrieve URLs. Status code: {response.status_code}")
```

- Replace `'http://localhost:3000'` with the actual URL where your API server is running.

#### Using JavaScript (Node.js)

Sending GET Requests to Retrieve URLs

- To retrieve a list of URLs from a starting URL using JavaScript (Node.js), you can use the `axios` library. Here's an example:

```javascript
const axios = require('axios');

// Replace with the URL of the API server
const apiURL = 'http://localhost:3000/urls';

// Define the starting URL
const startingURL = 'https://example.com';

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
```

- Replace `'http://localhost:3000'` with the actual URL where your API server is running.

### Scrape Data from URLs

You can scrape data from a list of URLs by making a POST request to the /scrape endpoint.

* Request

```bash
POST /scrape
Content-Type: application/json

{
  "urls": [
    "https://example.com/page1",
    "https://example.com/page2"
  ]
}
```
Replace the example URLs in the "urls" array with the URLs you want to scrape.

* Response

The response will be a JSON array containing objects with the scraped data for each URL. Each object includes the URL, page title, and cleaned text content.

#### Using Python

Sending POST Requests to Scrape Data

- To scrape data from a list of URLs using Python, you can use the `requests` library. Here's an example of how to do it:

```python
import requests

# Replace with the URL of the API server
api_url = 'http://localhost:3000/scrape'

# Define the list of URLs to scrape
urls_to_scrape = [
    'https://example.com/page1',
    'https://example.com/page2'
]

# Create a JSON payload
payload = {'urls': urls_to_scrape}

# Send a POST request to scrape data
response = requests.post(api_url, json=payload)

# Check if the request was successful
if response.status_code == 200:
    scraped_data = response.json()
    print("Scraped Data:")
    for data in scraped_data:
        print(f"URL: {data['url']}")
        print(f"Title: {data['title']}")
        print(f"Content: {data['data']}")
        print()
else:
    print(f"Failed to scrape data. Status code: {response.status_code}")
```

- Replace `'http://localhost:3000'` with the actual URL where your API server is running.

#### Using JavaScript (Node.js)

Sending POST Requests to Scrape Data

- To scrape data from a list of URLs using JavaScript (Node.js), you can use the `axios` library. Here's an example:

```javascript
const axios = require('axios');

// Replace with the URL of the API server
const apiURL = 'http://localhost:3000/scrape';

// Define the list of URLs to scrape
const urlsToScrape = [
  'https://example.com/page1',
  'https://example.com/page2',
];

// Create a JSON payload
const payload = { urls: urlsToScrape };

// Send a POST request to scrape data
axios.post(apiURL, payload)
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
```

- Replace `'http://localhost:3000'` with the actual URL where your API server is running.


## Error Handling

If an invalid URL is provided, the API will return a 500 Internal Server Error with an error message.

## CORS Configuration

By default, CORS is enabled for all origins during development for testing purposes. You can configure CORS by modifying the corsOptions object in the code.

## Dependencies

* Puppeteer
* Express.js
* compression
* cors
* puppeteer-extra
* puppeteer-extra-plugin-stealth

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more information.
