# Python 3 server example
from http.server import BaseHTTPRequestHandler, HTTPServer
import sys
import time
import json
import os

hostName = "localhost"
serverPort = 8080

def GetStartIndex(title):
    files = os.listdir(title)
    maxIndex = 0
    for file in files:
        spt = file.split('_')
        if file[0] == '.' or len(spt) != 2:
            continue

        maxIndex = max(maxIndex, int(spt[0]))

    return maxIndex + 1

title = sys.argv[1]
startIndex = GetStartIndex(title)
print('startIndex: ', startIndex)

index = startIndex
prev_title = ""

class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(bytes("<html><head><title>https://pythonbasics.org</title></head>", "utf-8"))
        self.wfile.write(bytes("<p>Request: %s</p>" % self.path, "utf-8"))
        self.wfile.write(bytes("<body>", "utf-8"))
        self.wfile.write(bytes("<p>This is an example web server.</p>", "utf-8"))
        self.wfile.write(bytes("</body></html>", "utf-8"))

    def do_POST(self):
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length) # <--- Gets the data itself
        data = json.loads(post_data.decode('utf-8'))

        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(b"response")
        print("data: ", data);

        global prev_title
        if (prev_title == data['title']):
            return

        prev_title = data['title']

        skip = False
        while True:
            pos = data['content'].find('\n谷')
            if pos == -1:
                break

            data['content'] = data['content'][:pos] + data['content'][pos+4:]


        with open(title + '.txt', 'a') as f:
            f.write("*** " + data['title'] + " ***\n\n")
            f.write(data['content'])
            f.write('\n')

        with open(title + '_' + str(startIndex) + '_to_.txt', 'a') as f:
            f.write("*** " + data['title'] + " ***\n\n")
            f.write(data['content'])
            f.write('\n')

        global index
        with open(title + '/' + str(index) + '_' + data['title'], 'a') as f:
            f.write("*** " + data['title'] + " ***\n\n")
            f.write(data['content'])

        index += 1

if __name__ == "__main__":        
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")
