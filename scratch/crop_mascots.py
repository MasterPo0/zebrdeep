import os
from PIL import Image, ImageOps

src_dir = r"C:\Users\asifs\.gemini\antigravity-ide\brain\750beb8d-8372-4ed0-ba7c-e312b8f748e2\.user_uploaded"
out_dir = r"c:\Users\asifs\MasterPo\Desktop\zebrdeep\src\assets\mascot"

os.makedirs(out_dir, exist_ok=True)

def auto_trim_png(img_path, save_name, padding=15):
    img = Image.open(img_path)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Get alpha bounding box
    bbox = img.getbbox()
    if bbox:
        left, upper, right, lower = bbox
        # Add padding safely within bounds
        left = max(0, left - padding)
        upper = max(0, upper - padding)
        right = min(img.width, right + padding)
        lower = min(img.height, lower + padding)
        
        cropped = img.crop((left, upper, right, lower))
        out_path = os.path.join(out_dir, save_name)
        cropped.save(out_path, 'PNG')
        print(f"Trimmed {img_path} -> {out_path} (size={cropped.size})")

# Process single transparent PNGs with safe margins
auto_trim_png(os.path.join(src_dir, 'media_1786652696373.png'), 'zebr-cool-jump.png', padding=15)
auto_trim_png(os.path.join(src_dir, 'media_1786652696467.png'), 'zebr-chill-beanbag.png', padding=15)
auto_trim_png(os.path.join(src_dir, 'media_1786652696503.png'), 'zebr-digital-apps.png', padding=15)

print("Single PNGs processed successfully!")
