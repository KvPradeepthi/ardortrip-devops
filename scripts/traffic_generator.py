#!/usr/bin/env python3
"""
ArdorTrip Synthetic Traffic Generator
Simulates user flight searches, reservations, and cancellations to produce live telemetry
for Prometheus scrape and Grafana APM dashboard visualization.
"""

import time
import random
import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8080"

ROUTES = [
    ("DEL", "BLR"),
    ("BLR", "DEL"),
    ("DEL", "HND"),
    ("HND", "DEL"),
    ("BLR", "SIN"),
    ("BOM", "SFO")
]

PASSENGERS = [
    ("Kenji Sato", "kenji@example.jp"),
    ("Priya Sharma", "priya@example.in"),
    ("John Doe", "john@example.com"),
    ("Yuki Takahashi", "yuki@example.jp"),
    ("Rahul Verma", "rahul@example.in")
]

def make_request(method, path, data=None):
    url = f"{BASE_URL}{path}"
    try:
        if method == "GET":
            req = urllib.request.Request(url)
        else:
            payload = json.dumps(data or {}).encode("utf-8")
            req = urllib.request.Request(url, data=payload, method=method)
            req.add_header("Content-Type", "application/json")
        with urllib.request.urlopen(req, timeout=3) as resp:
            return resp.status, resp.read().decode("utf-8")
    except Exception as e:
        return 500, str(e)

def run_traffic(duration_sec=30):
    print(f"[*] Starting synthetic traffic generation for {duration_sec}s against {BASE_URL}...")
    start_time = time.time()
    req_count = 0

    while time.time() - start_time < duration_sec:
        action = random.random()

        if action < 0.6:
            # 60% flight searches
            origin, dest = random.choice(ROUTES)
            status, _ = make_request("GET", f"/api/flights/search?origin={origin}&destination={dest}")
            req_count += 1
        elif action < 0.9:
            # 30% all flights
            status, _ = make_request("GET", "/api/flights")
            req_count += 1
        else:
            # 10% bookings
            name, email = random.choice(PASSENGERS)
            booking_payload = {
                "flightId": random.randint(1, 4),
                "seatNumber": f"{random.randint(1, 30)}{random.choice(['A', 'B', 'C', 'D', 'E', 'F'])}",
                "passengerName": name,
                "passengerEmail": email,
                "passengerPassport": f"PASS{random.randint(100000, 999999)}",
                "paymentMethod": "CREDIT_CARD",
                "cardNumber": "4532-XXXX-XXXX-1122"
            }
            status, resp = make_request("POST", "/api/bookings", booking_payload)
            req_count += 1
            if status == 200:
                try:
                    b_data = json.loads(resp)
                    # Occasionally cancel a booking
                    if random.random() < 0.3:
                        make_request("PUT", f"/api/bookings/{b_data['pnr']}/cancel")
                        req_count += 1
                except:
                    pass

        time.sleep(random.uniform(0.1, 0.4))

    print(f"[+] Traffic generation complete: {req_count} requests dispatched.")

if __name__ == "__main__":
    run_traffic(30)
