import os
from PIL import Image, ImageChops, ImageFilter

sheet_jpg = r"C:\Users\asifs\.gemini\antigravity-ide\brain\750beb8d-8372-4ed0-ba7c-e312b8f748e2\.user_uploaded\media_1786652758886.jpg"
out_dir = r"c:\Users\asifs\MasterPo\Desktop\zebrdeep\src\assets\mascot"

img = Image.open(sheet_jpg)
print("Sheet size:", img.size) # (1024, 682)

def remove_background(crop_img, bg_color=(14, 17, 22), tolerance=35):
    """
    Converts dark background pixels near bg_color to transparent.
    Also handles white/light backgrounds if needed.
    """
    crop_img = crop_img.convert("RGBA")
    datas = crop_img.getdata()
    
    new_data = []
    for item in datas:
        r, g, b, a = item
        # Check distance to background color
        dr = abs(r - bg_color[0])
        dg = abs(g - bg_color[1])
        db = abs(b - bg_color[2])
        
        # Also check if it's white/very light background
        is_light = (r > 240 and g > 240 and b > 240)
        
        if (dr < tolerance and dg < tolerance and db < tolerance) or is_light:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append((r, g, b, a))
            
    crop_img.putdata(new_data)
    return crop_img

# Let's crop the top row mascots:
# Mascot 5: Backpack / Walking (x: 560..680, y: 55..285)
# Mascot 6: Hoodie & Z Shield (x: 690..820, y: 55..285)
# Mascot 7: Lightbulb Idea (x: 825..1000, y: 45..285)

crops = {
    'zebr-backpack.png': (550, 40, 685, 290),
    'zebr-shield.png': (680, 40, 820, 290),
    'zebr-idea.png': (815, 30, 995, 290),
    # Headshots from middle row:
    'zebr-avatar-sunglasses.png': (350, 295, 490, 440),
    'zebr-avatar-thinking.png': (485, 295, 620, 440),
    'zebr-avatar-headset.png': (760, 295, 1000, 440),
}

for name, box in crops.items():
    cropped = img.crop(box)
    bg_sample = img.getpixel((box[0] + 5, box[1] + 5))
    transparent_crop = remove_background(cropped, bg_color=bg_sample[:3], tolerance=40)
    
    # Auto trim transparent padding
    bbox = transparent_crop.getbbox()
    if bbox:
        l, u, r, d = bbox
        # Add 12px padding so top/bottom/ears/feet are NOT cut off
        l = max(0, l - 12)
        u = max(0, u - 12)
        r = min(transparent_crop.width, r + 12)
        d = min(transparent_crop.height, d + 12)
        transparent_crop = transparent_crop.crop((l, u, r, d))
        
    out_path = os.path.join(out_dir, name)
    transparent_crop.save(out_path, 'PNG')
    print(f"Extracted {name} -> {out_path} (size={transparent_crop.size})")

