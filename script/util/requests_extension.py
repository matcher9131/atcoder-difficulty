from requests import Response
import requests
from time import sleep

def get_with_retry(
    url: str,
    *,
    timeout: float = 3.0,
    retry_count: int = 5,
    retry_interval: float = 3.0,
    retry_status_codes: list[int] = [500, 502, 503, 504],
    cookies: dict[str, str] = {},
) -> Response:
    ex: ConnectionError | TimeoutError | None = None
    response: Response | None = None

    for _ in range(retry_count):
        try:
            response = requests.get(url, timeout=timeout, cookies=cookies)
            if response.status_code in retry_status_codes:
                print(f"Retry {url} (Status code)")
                sleep(retry_interval)
                continue
            else:
                return response
        except ConnectionError as e:
            print(f"Retry {url} (Connection)")
            sleep(retry_interval)
            ex = e
            continue
        except TimeoutError as e:
            print(f"Retry {url} (Timeout)")
            sleep(retry_interval)
            ex = e
            continue
    
    if ex is not None:
        raise ex
    elif response is not None:
        if response.status_code in retry_status_codes:
            response.raise_for_status()
            assert False
        else:
            return response
    else:
        assert False
