from dotenv import load_dotenv
from pathlib import Path
import os

dotenv_path = Path('./.env')
load_dotenv(dotenv_path=dotenv_path)

VERIFY_SSL = True

WAIT_TIME_MIN = 1
WAIT_TIME_MAX = 3

USE_SEARCH = True
SEARCH_URL = '/fi/search?q='
SEARCH_TERMS = ["hello"]

# Locales from payload.config.ts
LOCALES = ['fi', 'en']

PAYLOAD_API_URL = os.getenv('PAYLOAD_API_URL', 'http://localhost:3000')
PAYLOAD_API_KEY = os.getenv('PAYLOAD_API_KEY')

# Define collections used in Payload CMS based on payload.config.ts
CONTENT_TYPES = ["users", "media", "articles", "collection-pages", "news", "categories", "contacts"]
PAGE_SIZE = 100
