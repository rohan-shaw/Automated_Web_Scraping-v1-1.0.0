const compression = require('compression')
const { URL } = require("url");
const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const express = require("express"); 
const cors = require("cors"); 
const { executablePath } = require("puppeteer");
const winston = require('winston');
require("dotenv").config();


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' }),
  ],
});

puppeteer.use(pluginStealth());

// Function to clean data 
function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

// const browser = puppeteer.launch({
//   executablePath: executablePath(),
//   headless: "new",
// });

// Function to get and return all urls
async function getAllUrls(startingUrl) {
    try {  
      const browser = await puppeteer.launch({
        executablePath: process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : executablePath(),
        headless: 'new',
        ignoreDefaultArgs: ['--disable-extensions'],
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--no-zygote'],
      });

      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
      );
      await page.goto(startingUrl, { waitUntil: 'domcontentloaded' });
  
      const pageLinks = new Set(await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href]'), (link) => link.href)
      ));
  
      await browser.close();
  
      return [...pageLinks];
    } catch (error) {
      return [error];
    }
  }

// Function to get scraped data for urls
async function scrapeUrl(url) {
    try {
      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
        headless: 'new',
        ignoreDefaultArgs: ['--disable-extensions'],
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
      );
  
      await page.goto(url, { waitUntil: 'domcontentloaded' });
  
      const pageTitle = await page.title();
      const pageContent = await page.evaluate(() =>
        document.body.innerText.trim()
      );
  
      const cleanedText = cleanText(pageContent);
  
      await browser.close();
  
      const jsonData = {
        url: url,
        title: pageTitle,
        data: cleanedText,
      };
  
      return jsonData;
    } catch (error) {
      return [error]
    }
  }

const app = express();

const corsOptions = {
  origin: "*", // Allow requests from any origin (for development purposes)
};

app.use(cors(corsOptions));

app.use(compression())

app.use(express.json());

app.get("/", async (req, res) => {
  logger.info('Received request for /')
  res.json({
    message: "Hello! Scraper is alive 🤞",
  })
})

// Route for /urls to get all urls from the main url
app.get("/urls", async (req, res) => {
  try {
    // Get the url parameter from the query string
    const url = req.query.url;

    logger.info(`Received request for /urls with url parameter: ${url}`);

    if (!url || !new URL(url).hostname) {
      logger.error('Invalid url parameter provided'); // Log error if invalid URL
      throw new Error("Invalid url parameter");
    }

    const urls = await getAllUrls(url);

    res.json(urls);
  } catch (error) {
    logger.error(`Error occurred in /urls route: ${error.message}`); 
    res.status(500).json({ message: error.message });
  }
});

// Roote for /scrape  to scrape data from each urls from the list of urls provided by user 
app.post("/scrape", async (req, res) => {
  try {
    // Get the urls parameter from the request body
    const urls = req.body.urls;

    logger.info(`Received request for /scrape with urls: ${urls}`); // Log request details

    if (
      !Array.isArray(urls) ||
      !urls.every((url) => typeof url === "string" && new URL(url).hostname)
    ) {
      logger.error('Invalid urls parameter provided'); // Log error if invalid URLs
      throw new Error("Invalid urls parameter");
    }

    const scrapedDataForUrls = [];

    for (const url of urls) {
      logger.info(`Starting scraping for url: ${url}`); // Log scraping process

      try {
        const scrapedData = await scrapeUrl(url);
        logger.info(`Scraped data for url ${url}: ${scrapedData}`); // Log scraped data
        scrapedDataForUrls.push(scrapedData);
      } catch (error) {
        logger.error(`Error scraping url ${url}: ${error.message}`); // Log scraping errors
      }
    }

    res.json(scrapedDataForUrls);

  } catch (error) {
    logger.error(`Error occurred in /scrape route: ${error.message}`); // Log general errors
    res.status(500).json({ message: error.message });
  }
});

app.listen(4000, () => {
  logger.info("Server is running on port 4000");
});
