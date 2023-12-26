import os
import requests

# Replace with your local server's URL
SERVER_URL = 'http://localhost:3000'

def scrape_and_save_data():
    try:
        # Make a POST request to the /scrape endpoint with a list of URLs
        response = requests.post(f'{SERVER_URL}/scrape', json={'urls': [
            "https://lumaticai.com/",
            "https://lumaticai.com/services/",
            "https://lumaticai.com/custom-ai-solutions/",
            "https://lumaticai.com/ai-consultancy/",
            "https://lumaticai.com/products/",
            "https://lumaticai.com/ai-chatbot/",
            "https://lumaticai.com/ai-search/",
            "https://lumaticai.com/contact/",
        ]})

        if response.status_code == 200:
            scraped_data = response.json()

            # Create a folder named "dataset" if it doesn't exist
            if not os.path.exists('dataset1'):
                os.makedirs('dataset1')

            # Save each scraped data as a text file
            for data in scraped_data:
                file_name = f'dataset1/{data["title"]}.txt'
                with open(file_name, 'w', encoding='utf-8') as file:
                    file.write(data['data'])
                print(f'Saved {file_name}')

            print('Scraping and saving completed.')
        else:
            print('Failed to scrape data.')

    except Exception as e:
        print('Error:', str(e))

if __name__ == '__main__':
    scrape_and_save_data()
