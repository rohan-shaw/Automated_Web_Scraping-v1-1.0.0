# -------------------------------- /urls -----------------------------------------------------

import requests

# Replace with the URL of the API server
api_url = 'http://localhost:3000/urls'

# Define the starting URL
starting_url = 'https://lumaticai.com'

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

# -------------------------------- /scrape -----------------------------------------------------

# import requests

# # Replace with the URL of the API server
# api_url = 'http://localhost:3000/scrape'

# # Define the list of URLs to scrape
# urls_to_scrape = [
#     'https://lumaticai.com/',
# '    https://lumaticai.com/services/'
# ]

# # Create a JSON payload
# payload = {'urls': urls_to_scrape}

# # Send a POST request to scrape data
# response = requests.post(api_url, json=payload)

# # Check if the request was successful
# if response.status_code == 200:
#     scraped_data = response.json()
#     print("Scraped Data:")
#     for data in scraped_data:
#         print(f"URL: {data['url']}")
#         print(f"Title: {data['title']}")
#         print(f"Content: {data['data']}")
#         print()
# else:
#     print(f"Failed to scrape data. Status code: {response.status_code}")