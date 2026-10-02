import os
import shutil

ASSETS_DIR = "assets/frames"
TARGET_DIR = "public/assets/frames"
os.makedirs(TARGET_DIR, exist_ok=True)

print("Preparing extended 80 frames sequence...")

# 1. Verify frames 1 to 40
for i in range(1, 41):
    src = os.path.join(ASSETS_DIR, f"frame_{str(i).zfill(3)}.png")
    dst = os.path.join(TARGET_DIR, f"frame_{str(i).zfill(3)}.png")
    if os.path.exists(src):
        shutil.copy2(src, dst)
    assert os.path.exists(dst), f"Missing frame {dst}"

# 2. Copy frames 0.25s (1).png to frames 0.25s (40).png as frame_041.png to frame_080.png
copied = 0
for i in range(1, 41):
    src = os.path.join(ASSETS_DIR, f"frames 0.25s ({i}).png")
    dst_idx = 40 + i # 41 to 80
    dst = os.path.join(TARGET_DIR, f"frame_{str(dst_idx).zfill(3)}.png")
    
    if os.path.exists(src):
        shutil.copy2(src, dst)
        copied += 1
    else:
        print(f"Warning: {src} not found!")

print(f"Copied {copied} continuous frames (41 to 80).")
total = len([f for f in os.listdir(TARGET_DIR) if f.startswith("frame_") and f.endswith(".png")])
print(f"Total frames now in {TARGET_DIR}: {total}")
