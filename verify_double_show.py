from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8000/test.html")

        # Trigger show 1
        print("Showing datepicker 1...")
        page.evaluate("dtp.show()")
        count = page.evaluate("window._keydownListenersCount")
        print(f"Keydown listeners after show 1: {count}")

        # Trigger show 2
        print("Showing datepicker 2...")
        page.evaluate("dtp.show()")
        count = page.evaluate("window._keydownListenersCount")
        print(f"Keydown listeners after show 2: {count}")

        # Trigger hide
        print("Hiding datepicker...")
        page.evaluate("dtp.hide()")
        count = page.evaluate("window._keydownListenersCount")
        print(f"Keydown listeners after hide: {count}")

        if count != 0:
            print("FAIL: Listeners leaked!")
        else:
            print("SUCCESS: No leaks.")

        browser.close()

if __name__ == "__main__":
    run()
