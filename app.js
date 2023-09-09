const compression = require('compression')
const { URL } = require("url");
const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const express = require("express"); 
const cors = require("cors"); 
const { executablePath } = require("puppeteer");

puppeteer.use(pluginStealth());

// Function to clean data 
function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

// Function to get and return all urls
async function getAllUrls(startingUrl) {
    try {
      const browser = await puppeteer.launch({
        executablePath: executablePath(),
        headless: "new",
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
        executablePath: executablePath(),
        headless: "new",
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

// app.use(cors());

const corsOptions = {
  origin: "*", // Allow requests from any origin (for development purposes)
};

app.use(cors(corsOptions));

app.use(compression())

app.use(express.json());

// Route for /urls to get all urls from the main url
app.get("/urls", async (req, res) => {
  try {
    // Get the url parameter from the query string
    const url = req.query.url;

    if (!url || !new URL(url).hostname) {
      throw new Error("Invalid url parameter");
    }

    const urls = await getAllUrls(url);

    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rpote for /scrape  to scrape data from each urls from the list of urls provided by user 
app.post("/scrape", async (req, res) => {
  try {
    // Get the urls parameter from the request body
    const urls = req.body.urls;

    if (
      !Array.isArray(urls) ||
      !urls.every((url) => typeof url === "string" && new URL(url).hostname)
    ) {
      throw new Error("Invalid urls parameter");
    }

    const scrapedDataForUrls = [];

    for (const url of urls) {
      const scrapedData = await scrapeUrl(url);

      scrapedDataForUrls.push(scrapedData);
    }

    res.json(scrapedDataForUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
