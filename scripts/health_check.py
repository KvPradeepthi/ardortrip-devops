#!/usr/bin/env python3
"""
ArdorTrip Airline Booking System - Health & Verification Utility
Used by CI/CD pipelines, Docker healthchecks, and Kubernetes post-deployment validation.
"""

import sys
import json
import urllib.request
import urllib.error

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"

def get(path, token=None):
    req = urllib.request.Request(f"{BASE_URL}{path}")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=5) as resp:
        return resp.status, resp.read().decode("utf-8")

def post(path, data, token=None):
    payload = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(f"{BASE_URL}{path}", data=payload, method="POST")
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=5) as resp:
        return resp.status, resp.read().decode("utf-8")

def main():
    print(f"[*] Probing ArdorTrip backend at {BASE_URL}...")
    errors = []

    # 1. Liveness & Readiness Probes
    try:
        status, body = get("/actuator/health/readiness")
        data = json.loads(body)
        assert status == 200 and data.get("status") == "UP"
        print("[+] Kubernetes Readiness Probe: UP (200 OK)")
    except Exception as e:
        errors.append(f"Readiness probe failed: {e}")

    try:
        status, body = get("/actuator/health/liveness")
        data = json.loads(body)
        assert status == 200 and data.get("status") == "UP"
        print("[+] Kubernetes Liveness Probe: UP (200 OK)")
    except Exception as e:
        errors.append(f"Liveness probe failed: {e}")

    # 2. Prometheus Endpoint
    try:
        status, body = get("/actuator/prometheus")
        assert status == 200 and "jvm_memory_used_bytes" in body
        print("[+] Prometheus Metrics Scrape Endpoint: Active (200 OK)")
    except Exception as e:
        errors.append(f"Prometheus metrics probe failed: {e}")

    # 3. Flight Inventory API
    try:
        status, body = get("/api/flights")
        flights = json.loads(body)
        assert status == 200 and len(flights) > 0
        print(f"[+] Flight Service API: Verified ({len(flights)} flights loaded)")
    except Exception as e:
        errors.append(f"Flight service probe failed: {e}")

    # 4. Authentication API
    try:
        status, body = post("/api/auth/login", {"username": "admin", "password": "admin123"})
        auth_data = json.loads(body)
        assert status == 200 and "token" in auth_data
        print("[+] Authentication & JWT Service: Verified (Admin authenticated)")
    except Exception as e:
        errors.append(f"Authentication probe failed: {e}")

    if errors:
        print(f"[-] Health verification failed with {len(errors)} errors:")
        for err in errors:
            print(f"    - {err}")
        sys.exit(1)
    else:
        print("[*] ALL HEALTH CHECKS PASSED SUCCESSFULLY!")
        sys.exit(0)

if __name__ == "__main__":
    main()
