import os
import requests
from dotenv import load_dotenv
from html.parser import HTMLParser

class CsrfExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.csrf = None
    
    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        dic_attrs = dict(attrs)
        if (tag == "input" and dic_attrs.get("name") == "csrf_token"):
            self.csrf = dic_attrs["value"]
    
    def extract(self, html: str) -> str:
        self.feed(html)
        if (self.csrf is not None):
            return self.csrf
        else:
            raise ValueError("Faild extracting CSRF token")


def extract_csrf(response_text: str):
    extractor = CsrfExtractor()
    return extractor.extract(response_text)

def login() -> requests.Session:
    load_dotenv(".env")
    user_id = os.getenv("USER_ID")
    if user_id is None:
        raise ValueError("Invalid USER_ID")
    password = os.getenv("PASSWORD")
    if password is None:
        raise ValueError("Invalid PASSWORD")
    
    session = requests.Session()
    response_get = session.get("https://atcoder.jp/login")
    csrf = extract_csrf(response_get.text)
    post_data = {
        "username": user_id,
        "password": password,
        "csrf_token": csrf
    }
    response_post = session.post("https://atcoder.jp/login", data=post_data)
    if (response_post.status_code != 200):
        raise Exception(str(response_post))
    return session