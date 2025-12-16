from playwright.sync_api import sync_playwright
import time
import sys
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8000/test.html")

        # Trigger show
        print("Showing datepicker...")
        page.evaluate("dtp.show()")

        count = page.evaluate("window._keydownListenersCount")
        print(f"Keydown listeners after show: {count}")

        # Trigger hide
        print("Hiding datepicker...")
        page.evaluate("dtp.hide()")

        count = page.evaluate("window._keydownListenersCount")
        print(f"Keydown listeners after hide: {count}")

        browser.close()

if __name__ == "__main__":
    run()
