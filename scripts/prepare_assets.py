import os
import shutil
import subprocess

def prepare_assets():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assets_dir = os.path.join(base_dir, "assets")
    public_dir = os.path.join(base_dir, "public", "assets")
    
    img_dest = os.path.join(public_dir, "images")
    frames_dest = os.path.join(public_dir, "frames")
    audio_dest = os.path.join(public_dir, "audio")
    
    os.makedirs(img_dest, exist_ok=True)
    os.makedirs(frames_dest, exist_ok=True)
    os.makedirs(audio_dest, exist_ok=True)
    
    print("Copying images...")
    # Background
    bg_src = os.path.join(assets_dir, "images", "background", "ed211217-e2aa-442e-9873-75b65a541a07.png")
    if os.path.exists(bg_src):
        shutil.copy2(bg_src, os.path.join(img_dest, "background.png"))
        shutil.copy2(bg_src, os.path.join(img_dest, "ed211217-e2aa-442e-9873-75b65a541a07.png"))
        print(" Copied background image")
        
    # Transformation
    before_src = os.path.join(assets_dir, "images", "body transformation", "skinny boy(amit).png")
    after_src = os.path.join(assets_dir, "images", "body transformation", "transformation of amit into muscular in 90 days .png")
    if os.path.exists(before_src):
        shutil.copy2(before_src, os.path.join(img_dest, "transformation_before.png"))
        shutil.copy2(before_src, os.path.join(img_dest, "skinny boy(amit).png"))
        print(" Copied before image")
    if os.path.exists(after_src):
        shutil.copy2(after_src, os.path.join(img_dest, "transformation_after.png"))
        shutil.copy2(after_src, os.path.join(img_dest, "transformation of amit into muscular in 90 days .png"))
        print(" Copied after image")
        
    # Review characters
    c1 = os.path.join(assets_dir, "images", "review character", "02a2226d-1a2f-4d17-9fe5-da9a5b217889.png")
    c2 = os.path.join(assets_dir, "images", "review character", "967a4b1f-4276-4f49-85cc-e79fdb685bac.png")
    c3 = os.path.join(assets_dir, "images", "review character", "a5f7dd2a-f2be-4e56-a0ab-d2d3c45fa95e.png")
    if os.path.exists(c1):
        shutil.copy2(c1, os.path.join(img_dest, "avatar_1.png"))
        shutil.copy2(c1, os.path.join(img_dest, "02a2226d-1a2f-4d17-9fe5-da9a5b217889.png"))
    if os.path.exists(c2):
        shutil.copy2(c2, os.path.join(img_dest, "avatar_2.png"))
        shutil.copy2(c2, os.path.join(img_dest, "967a4b1f-4276-4f49-85cc-e79fdb685bac.png"))
    if os.path.exists(c3):
        shutil.copy2(c3, os.path.join(img_dest, "avatar_3.png"))
        shutil.copy2(c3, os.path.join(img_dest, "a5f7dd2a-f2be-4e56-a0ab-d2d3c45fa95e.png"))
    print(" Copied avatars")
    
    # Frames (frame_001 to frame_040)
    print("Copying animation frames...")
    frames_src = os.path.join(assets_dir, "frames")
    for i in range(1, 41):
        fname = f"frame_{i:03d}.png"
        src_path = os.path.join(frames_src, fname)
        if os.path.exists(src_path):
            shutil.copy2(src_path, os.path.join(frames_dest, fname))
    print(" Copied 40 door transition frames")
    
    # Audio processing with ffmpeg
    print("Processing audio tracks...")
    audio_map = {
        "Raya _Slowed_": "raya_slowed",
        "MONTAGEM TENTA _Mega Slowed_": "montagem_tenta_slowed",
        "SEM DEMORA _Super Slowed_": "sem_demora_slowed"
    }
    
    for filename in os.listdir(os.path.join(assets_dir, "audio")):
        full_src = os.path.join(assets_dir, "audio", filename)
        if "Raya" in filename:
            target_base = "raya_slowed"
        elif "MONTAGEM" in filename:
            target_base = "montagem_tenta_slowed"
        elif "SEM DEMORA" in filename:
            target_base = "sem_demora_slowed"
        else:
            target_base = "brazilian_phonk_mix"
            
        m4a_target = os.path.join(audio_dest, f"{target_base}.m4a")
        mp3_target = os.path.join(audio_dest, f"{target_base}.mp3")
        
        # M4A copy
        if not os.path.exists(m4a_target):
            cmd = ["ffmpeg", "-i", full_src, "-c", "copy", m4a_target, "-y"]
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f" Generated {target_base}.m4a")
            
        # MP3 fallback (fast encode)
        if not os.path.exists(mp3_target) and target_base != "brazilian_phonk_mix":
            cmd = ["ffmpeg", "-i", full_src, "-c:a", "libmp3lame", "-b:a", "128k", mp3_target, "-y"]
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f" Generated {target_base}.mp3")
            
    print("Asset preparation complete!")

if __name__ == "__main__":
    prepare_assets()
