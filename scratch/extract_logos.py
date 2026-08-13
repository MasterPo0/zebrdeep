import os
from PIL import Image

logo_png = r"C:\Users\asifs\.gemini\antigravity-ide\brain\750beb8d-8372-4ed0-ba7c-e312b8f748e2\.user_uploaded\media_1786652707207.png"
out_dir = r"c:\Users\asifs\MasterPo\Desktop\zebrdeep\src\assets\mascot"

img = Image.open(logo_png)
print("Logo sheet size:", img.size)

crops = {
    'zebr-logo-shield.png': (10, 10, 160, 230),
    'zebr-logo-circle.png': (170, 10, 335, 230),
    'zebr-logo-esports.png': (340, 10, 500, 230),
    'zebr-logo-z.png': (510, 10, 640, 230),
    'zebr-logo-head.png': (645, 10, 765, 230)
}

for name, box in crops.items():
    cropped = img.crop(box)
    bbox = cropped.getbbox()
    if bbox:
        l, u, r, d = bbox
        l = max(0, l - 8)
        u = max(0, u - 8)
        r = min(cropped.width, r + 8)
        d = min(cropped.height, d + 8)
        cropped = cropped.crop((l, u, r, d))
    out_path = os.path.join(out_dir, name)
    cropped.save(out_path, 'PNG')
    print(f"Extracted logo {name} -> {out_path} (size={cropped.size})")
