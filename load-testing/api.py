import random, json
import configs

class Api:

    def __init__(self, client):
        self.client = client
        self.client.verify = configs.VERIFY_SSL
        self.locales = configs.LOCALES
        self.articles = []
        self.collection_pages = []
        self.news = []
        self.categories = []
        self.contacts = []
        self.media = []
        
    def load_front_page(self):
        locale = random.choice(self.locales)
        self.client.get(f"/{locale}",
                        name=f"Load front page ({locale})")

    def load_article(self):
        if not self.articles: return
        content = random.choice(self.articles)
        locale = content.get("locale", "fi")
        slug = content.get("slug")
        self.client.get(
            f"/{locale}/articles/{slug}",
            name=f"Load random article ({locale})"
        )

    def load_collection_page(self):
        if not self.collection_pages: return
        content = random.choice(self.collection_pages)
        locale = content.get("locale", "fi")
        slug = content.get("slug")
        self.client.get(
            f"/{locale}/{slug}",
            name=f"Load random collection page ({locale})"
        )

    def load_news(self):
        if not self.news: return
        content = random.choice(self.news)
        locale = content.get("locale", "fi")
        slug = content.get("slug")
        self.client.get(
            f"/{locale}/news/{slug}",
            name=f"Load random news ({locale})"
        )

    def load_media(self):
        if not self.media: return
        media = random.choice(self.media)
        filename = media.get("filename")
        self.client.get(
            f"/media/{filename}",
            name=f"Load random media"
        )

    def use_search(self):
        # Skip if search is not enabled
        if not configs.USE_SEARCH:
            return
        self.client.get(f"{configs.SEARCH_URL}{random.choice(configs.SEARCH_TERMS)}",
                           name="Search content")

    def load_404(self):
        locale = random.choice(self.locales)
        with self.client.get(f"/{locale}/non-existing-page",
                        catch_response=True) as response:
            response.request_meta["name"] = f"Load 404 page ({locale})"
            if response.status_code == 404:
                response.success()

    def load_admin_login(self):
        self.client.get("/admin/login",
                        name="Load admin login page")

    def load_api_health(self):
        self.client.get("/api/health",
                        name="Check API health")

    def fetch_content(self):
        headers = {}
        if configs.PAYLOAD_API_KEY:
            headers["Authorization"] = f"Bearer {configs.PAYLOAD_API_KEY}"

        for content_type in configs.CONTENT_TYPES:
            response = self.client.get(
                f"{configs.PAYLOAD_API_URL}/api/{content_type}?limit={configs.PAGE_SIZE}&depth=0",
                headers=headers,
                catch_response=True,
                name=f"Fetch {content_type}"
            )
            
            try:
                data = response.json()
                docs = data.get("docs", [])
                
                if content_type == "articles":
                    self.articles = docs
                elif content_type == "collection-pages":
                    self.collection_pages = docs
                elif content_type == "news":
                    self.news = docs
                elif content_type == "categories":
                    self.categories = docs
                elif content_type == "contacts":
                    self.contacts = docs
                elif content_type == "media":
                    self.media = docs
            except Exception as e:
                print(f"Error fetching {content_type}: {e}")
