from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json

folder = Path('output/media')
projects = json.loads((folder / 'audit.json').read_text(encoding='utf-8'))
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 22)
for batch in range(3):
    items = projects[batch * 6:(batch + 1) * 6]
    sheet = Image.new('RGB', (1080, len(items) * 440), '#191d1b')
    draw = ImageDraw.Draw(sheet)
    for row, item in enumerate(items):
        draw.text((14, row * 440 + 8), f"{item['title']} | {item['width']} x {item['height']}", font=font, fill='white')
        for n in range(3):
            frame = Image.open(folder / f"{item['id']}-{n}.jpg")
            frame.thumbnail((350, 390))
            sheet.paste(frame, (n * 360 + (360 - frame.width) // 2, row * 440 + 42 + (390 - frame.height) // 2))
    sheet.save(folder / f'contact-sheet-{batch + 1}.jpg', quality=92)
