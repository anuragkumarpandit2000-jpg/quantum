import os
import shutil
import glob

SOURCE_DIR = "assets/images/review character"
TARGET_DIR = "public/assets/images/avatars"
os.makedirs(TARGET_DIR, exist_ok=True)

all_files = sorted(glob.glob(os.path.join(SOURCE_DIR, "*.*")))
print(f"Found {len(all_files)} character images in {SOURCE_DIR}")

avatar_paths = []
for i, f in enumerate(all_files, start=1):
    ext = os.path.splitext(f)[1].lower()
    target_name = f"avatar_{str(i).zfill(2)}{ext}"
    target_path = os.path.join(TARGET_DIR, target_name)
    shutil.copy2(f, target_path)
    # Also keep a copy of original basename in avatars for direct referencing
    shutil.copy2(f, os.path.join(TARGET_DIR, os.path.basename(f)))
    avatar_paths.append(f"/assets/images/avatars/{target_name}")

print(f"Successfully copied {len(avatar_paths)} avatars into {TARGET_DIR}.")
print("Sample avatar paths:", avatar_paths[:5])
