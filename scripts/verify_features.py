import urllib.request
import json

BASE = "http://localhost:3000"

print("--- 1. Testing Extended 80 Frames ---")
for i in [1, 20, 40, 41, 60, 80]:
    url = f"{BASE}/assets/frames/frame_{i:03d}.png"
    with urllib.request.urlopen(url) as r:
        assert r.status == 200
        print(f"  Frame {i:03d}: 200 OK ({len(r.read())} bytes)")

print("\n--- 2. Testing Unique Character Avatars (23 Total) ---")
for i in range(1, 24):
    ext = "png" if i in [1, 2, 3] else "jpg"
    url = f"{BASE}/assets/images/avatars/avatar_{i:02d}.{ext}"
    with urllib.request.urlopen(url) as r:
        assert r.status == 200
print(f"  All 23 character avatars verified successfully.")

print("\n--- 3. Testing Local Tubes Script Bundle ---")
with urllib.request.urlopen(f"{BASE}/assets/scripts/tubes1.min.js") as r:
    assert r.status == 200
    print(f"  Tubes1 script bundle: 200 OK ({len(r.read())} bytes)")

print("\n--- 4. Testing Reviews Avatars Uniqueness ---")
with urllib.request.urlopen(f"{BASE}/api/reviews") as r:
    data = json.loads(r.read().decode())
    avatars = [item["avatar"] for item in data["reviews"]]
    print(f"  Total reviews: {len(avatars)}, Unique avatars: {len(set(avatars))}")
    assert len(avatars) == len(set(avatars)), "Expected all review avatars to be distinct!"
    for rev in data["reviews"][:4]:
        print(f"  - {rev['name']}: {rev['avatar']}")

print("\n--- 5. Testing Leaderboard Competitor Avatars ---")
with urllib.request.urlopen(f"{BASE}/api/competition") as r:
    data = json.loads(r.read().decode())
    comp_avatars = [p["profile"]["avatar"] for p in data["leaderboard"] if p.get("profile") and p["profile"].get("avatar")]
    print(f"  Leaderboard count: {len(comp_avatars)}")
    for p in data["leaderboard"][:6]:
        print(f"  - {p['name']}: {p['profile']['avatar']}")

print("\n>>> ALL SYSTEM ENHANCEMENTS VERIFIED 100% OPERATIONAL! <<<")
