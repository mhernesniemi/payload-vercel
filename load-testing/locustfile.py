from locust import HttpUser, between, task
import api
import configs

class StandardUser(HttpUser):

    wait_time = between(configs.WAIT_TIME_MIN,
                        configs.WAIT_TIME_MAX)

    def on_start(self):
        self.api = api.Api(self.client)
        self.api.fetch_content()

    @task(5)
    def load_front_page(self):
        self.api.load_front_page()

    @task(3)
    def load_article(self):
        self.api.load_article()

    @task(3)
    def load_collection_page(self):
        self.api.load_collection_page()

    @task(3)
    def load_news(self):
        self.api.load_news()

    @task(2)
    def load_media(self):
        self.api.load_media()

    @task(1)
    def load_404(self):
        self.api.load_404()

    @task(3)
    def use_search(self):
        # Won't occur unless search is enabled
        self.api.use_search()

    @task(1)
    def load_api_health(self):
        self.api.load_api_health()

    @task(1)
    def load_admin_login(self):
        self.api.load_admin_login()

    def on_stop(self):
        return
