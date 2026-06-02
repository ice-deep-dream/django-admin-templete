import random
import string
from io import BytesIO

from PIL import Image, ImageDraw, ImageFont


def generate_captcha_text(length=4):
    chars = string.digits + string.ascii_uppercase
    return "".join(random.choice(chars) for _ in range(length))


def generate_captcha_image(text, width=120, height=40):
    bg_color = (240, 240, 240)
    image = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(image)

    for _ in range(5):
        x1 = random.randint(0, width)
        y1 = random.randint(0, height)
        x2 = random.randint(0, width)
        y2 = random.randint(0, height)
        color = (random.randint(150, 220), random.randint(150, 220), random.randint(150, 220))
        draw.line([(x1, y1), (x2, y2)], fill=color, width=1)

    for _ in range(30):
        x = random.randint(0, width)
        y = random.randint(0, height)
        color = (random.randint(150, 220), random.randint(150, 220), random.randint(150, 220))
        draw.point((x, y), fill=color)

    try:
        font = ImageFont.truetype("arial.ttf", 24)
    except (OSError, IOError):
        font = ImageFont.load_default()

    char_width = width // (len(text) + 1)
    for i, char in enumerate(text):
        color = (random.randint(30, 100), random.randint(30, 100), random.randint(30, 100))
        x = char_width * (i + 1) - 5
        y = random.randint(5, 12)
        draw.text((x, y), char, fill=color, font=font)

    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()