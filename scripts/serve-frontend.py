#!/usr/bin/env python3
"""
LandGuard AI - Static Development Server
Serves the frontend directory over HTTP with proper MIME types and no-cache headers.
Contains NO backend business logic or database access.
"""

import http.server
import socketserver
import os
import sys

PORT = int(os.environ.get("PORT", 8080))
DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

class LandGuardStaticHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Prevent aggressive browser caching during frontend development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def main():
    os.chdir(DIRECTORY)
    print(f"==================================================")
    print(f" LandGuard AI - Frontend Static Server")
    print(f" Serving folder: {DIRECTORY}")
    print(f" Open in browser: http://localhost:{PORT}")
    print(f"==================================================")
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", PORT), LandGuardStaticHTTPHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    main()
