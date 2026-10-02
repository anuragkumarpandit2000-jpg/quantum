import urllib.request
import json
import http.cookiejar
import uuid

BASE_URL = "http://localhost:3000"

def test_full_onboarding_journey():
    print("========================================")
    print("TESTING FULL ONBOARDING & CERTIFICATE FLOW")
    print("========================================")
    
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    
    unique_user = f"challenger_{uuid.uuid4().hex[:6]}"
    email = f"{unique_user}@winterarc.org"
    password = "QuantumPassword123!"
    
    # 1. Signup
    print(f"\n1. Registering new challenger: {email}...")
    signup_payload = json.dumps({
        "name": "Marcus Aurelius",
        "username": unique_user,
        "email": email,
        "password": password
    }).encode("utf-8")
    
    req = urllib.request.Request(
        f"{BASE_URL}/api/auth/signup",
        data=signup_payload,
        headers={"Content-Type": "application/json"}
    )
    with opener.open(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        assert res.status == 201
        assert data["user"]["email"] == email
        print(f" Account created successfully. Onboarding Done: {data['user']['onboardingDone']}")
        
    # 2. Check Session
    print("\n2. Checking session for new user...")
    req = urllib.request.Request(f"{BASE_URL}/api/auth/me")
    with opener.open(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        assert res.status == 200
        assert data["user"]["username"] == unique_user
        print(f" Session confirmed. Current Level: {data['user']['profile']['level']}")

    # 3. Submit Multi-step Onboarding
    print("\n3. Submitting 90-Day Commitment Protocol (Onboarding)...")
    onboarding_payload = json.dumps({
        "name": "Marcus Aurelius",
        "currentClass": "Stoic Discipline Tier I",
        "age": 28,
        "dailyAvailableHours": 4,
        "objective": "Achieve absolute physical and mental fortitude across the 90 days.",
        "habits": ["MEDITATION", "STRENGTH TRAINING", "DEEP STUDY", "DIGITAL DETOX"],
        "skillTitle": "High-Frequency System Architecture"
    }).encode("utf-8")
    
    req = urllib.request.Request(
        f"{BASE_URL}/api/onboarding",
        data=onboarding_payload,
        headers={"Content-Type": "application/json"}
    )
    with opener.open(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        assert res.status == 200
        assert data["success"] == True
        print(f" Onboarding committed!")
        print(f" Certificate Issued: {data['certificate']['certificateNumber']} (Recipient: {data['certificate']['userName']})")

    # 4. Verify Habits on Dashboard
    print("\n4. Verifying Dashboard API returns newly committed habits...")
    req = urllib.request.Request(f"{BASE_URL}/api/habits")
    with opener.open(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        assert res.status == 200
        assert len(data["habits"]) == 4
        print(f" Habits API returned 4 initialized habits for {unique_user}.")

    # 5. Check Profile & Certificate
    print("\n5. Verifying Profile & Certificate persistence...")
    req = urllib.request.Request(f"{BASE_URL}/api/profile")
    with opener.open(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        assert res.status == 200
        user_prof = data["user"]
        assert len(user_prof["certificates"]) >= 1
        assert user_prof["profile"]["onboardingDone"] == True
        print(f" Profile verified: OnboardingDone={user_prof['profile']['onboardingDone']}, Certificates={len(user_prof['certificates'])}.")

    print("\n========================================")
    print("END-TO-END ONBOARDING JOURNEY VERIFIED!")
    print("========================================")

if __name__ == "__main__":
    test_full_onboarding_journey()
