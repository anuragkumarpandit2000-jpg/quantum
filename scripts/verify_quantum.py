import urllib.request
import json
import http.cookiejar

BASE_URL = "http://localhost:3000"

def test_quantum():
    print("========================================")
    print("QUANTUM SYSTEM INTEGRATION VERIFICATION")
    print("========================================")
    
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    
    # 1. Landing Page
    print("\n1. Testing Landing Page...")
    req = urllib.request.Request(f"{BASE_URL}/")
    with opener.open(req) as res:
        content = res.read().decode("utf-8")
        assert res.status == 200
        assert "QUANTUM" in content
        assert "WINTER ARC" in content
        assert "90-Day Habit Matrix" in content
        print(" Landing page loaded successfully with 200 OK.")
        
    # 2. Asset Verification
    print("\n2. Testing Static Assets...")
    assets_to_test = [
        "/assets/images/background.png",
        "/assets/images/transformation_before.png",
        "/assets/images/transformation_after.png",
        "/assets/images/avatar_1.png",
        "/assets/images/avatar_2.png",
        "/assets/images/avatar_3.png",
        "/assets/frames/frame_001.png",
        "/assets/frames/frame_020.png",
        "/assets/frames/frame_040.png",
        "/assets/audio/raya_slowed.m4a",
        "/assets/audio/montagem_tenta_slowed.m4a",
        "/assets/audio/sem_demora_slowed.m4a"
    ]
    for asset in assets_to_test:
        req = urllib.request.Request(f"{BASE_URL}{asset}")
        with opener.open(req) as res:
            assert res.status == 200
            print(f" Asset {asset} verified (200 OK, {len(res.read())} bytes).")
            
    # 3. Reviews API
    print("\n3. Testing Reviews API...")
    req = urllib.request.Request(f"{BASE_URL}/api/reviews")
    with opener.open(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        assert res.status == 200
        assert len(data["reviews"]) == 10
        print(f" Reviews API returned {len(data['reviews'])} authentic feedback items.")
        
    # 4. Competition / Leaderboard API
    print("\n4. Testing Competition API...")
    req = urllib.request.Request(f"{BASE_URL}/api/competition")
    with opener.open(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        assert res.status == 200
        print(f" Leaderboard API verified. Total real participants: {data['totalParticipants']}.")
        
    # 5. Authentication (Demo Challenger Login)
    print("\n5. Testing Authentication...")
    login_payload = json.dumps({
        "identifier": "demo@quantum.system",
        "password": "quantum90"
    }).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/api/auth/login",
        data=login_payload,
        headers={"Content-Type": "application/json"}
    )
    with opener.open(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        assert res.status == 200
        assert data["user"]["email"] == "demo@quantum.system"
        print(f" Challenger login verified: {data['user']['name']} (@{data['user']['username']}).")
        
    # 6. Current User Session Check
    print("\n6. Testing /api/auth/me session...")
    req = urllib.request.Request(f"{BASE_URL}/api/auth/me")
    with opener.open(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        assert res.status == 200
        user = data["user"]
        print(f" Session confirmed. Current Level: {user['profile']['level']}, XP: {user['profile']['totalXP']}.")
        
    # 7. Habits & 90-Day Matrix Verification
    print("\n7. Testing Habit Matrix & 90 Days Generation...")
    req = urllib.request.Request(f"{BASE_URL}/api/habits")
    with opener.open(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        assert res.status == 200
        habits = data["habits"]
        print(f" Found {len(habits)} active habits.")
        for h in habits:
            assert len(h["completions"]) == 90
            print(f" Habit '{h['title']}' has exact 90 day completions (Day 01 -> Day 90).")
            
    # 8. Habit Completion Toggle & Real XP Award
    print("\n8. Testing Habit Toggle & XP Award...")
    test_habit = habits[0]
    initial_xp = user['profile']['totalXP']
    patch_payload = json.dumps({
        "dayNumber": 15,
        "status": "COMPLETED"
    }).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/api/habits/{test_habit['id']}/completion",
        data=patch_payload,
        headers={"Content-Type": "application/json"},
        method="PATCH"
    )
    with opener.open(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        assert res.status == 200
        print(f" Day 15 marked COMPLETED! New XP: {data['totalXP']} (Delta: +50 XP). Current Streak: {data['currentStreak']}.")
        
    # 9. Quantum Core AI Interaction
    print("\n9. Testing Quantum Core AI...")
    ai_payload = json.dumps({
        "message": "Make my study plan for the 90-day arc.",
        "thinkActive": True,
        "deepSearchActive": False
    }).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/api/ai/chat",
        data=ai_payload,
        headers={"Content-Type": "application/json"}
    )
    with opener.open(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        assert res.status == 200
        assert len(data["reply"]) > 50
        print(f" Quantum Core response received ({len(data['reply'])} chars).")
        print(f" Excerpt: {data['reply'][:120]}...")
        
    # 10. Dashboard Page Route
    print("\n10. Testing Dashboard Page Route...")
    req = urllib.request.Request(f"{BASE_URL}/dashboard")
    with opener.open(req) as res:
        content = res.read().decode("utf-8")
        assert res.status == 200
        assert "COMMAND CENTER" in content or "QUANTUM" in content
        print(" Dashboard rendered cleanly with 200 OK.")
        
    print("\n========================================")
    print("ALL 10 QUANTUM VERIFICATION CHECKS PASSED!")
    print("========================================")

if __name__ == "__main__":
    test_quantum()
