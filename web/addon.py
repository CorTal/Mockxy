from mitmproxy import http
class AddHeader:
    def request(self, flow: http.HTTPFlow) -> None:
        # pretty_url takes the "Host" header of the request into account, which
        # is useful in transparent mode where we usually only have the IP otherwise.
        print(flow.intercepted)
        if flow.intercepted:

            flow.response = http.HTTPResponse.make(
                200,  # (optional) status code
                b"Hello World",  # (optional) content
                {"Content-Type": "text/html"}  # (optional) headers
            )
            flow.resume()



addons = [
    AddHeader()
]
