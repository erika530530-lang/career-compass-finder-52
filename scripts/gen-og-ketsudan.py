"""
決断力診断の結果ページ用OGP画像（1200x630）を生成するスクリプト。

使い方:
    python3 scripts/gen-og-ketsudan.py

- 結果イラストは public/images/diagnoses/result/ketsudan-result-{level}.png
- 出力は public/og/ketsudan/{level}.jpg
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "public", "images", "diagnoses", "result")
OUT_DIR = os.path.join(ROOT, "public", "og", "ketsudan")

TTC = "/nix/store/722ld9djs9awdc7x0m2ppar493ajz1b0-noto-fonts-cjk-sans-2.004/share/fonts/opentype/noto-cjk/NotoSansCJK-VF.otf.ttc"

W, H = 1200, 630
NAVY = (24, 45, 106)
BLUE = (58, 106, 214)
PURPLE = (140, 116, 214)
BAR = (28, 46, 96)

BANDS = [
    {"level": "high", "title": "秒で決める人・決断力エース", "range": "決断力 75〜100%"},
    {"level": "medium", "title": "考えてから決める・堅実タイプ", "range": "決断力 50〜74%"},
    {"level": "low", "title": "けっこう迷う・お悩み常連タイプ", "range": "決断力 25〜49%"},
    {"level": "minimal", "title": "全部おまかせ・究極の平和主義", "range": "決断力 0〜24%"},
]


def font(size, weight="Bold"):
    ft = ImageFont.truetype(TTC, size, index=0)
    ft.set_variation_by_name(weight)
    return ft


def bg():
    small = Image.new("RGB", (12, 8))
    px = small.load()
    for y in range(8):
        for x in range(12):
            t = (x / 11 * 0.6) + (y / 7 * 0.4)
            px[x, y] = (int(252 - 14 * t), int(252 - 8 * t), int(255 - 2 * t))
    return small.resize((W, H), Image.BICUBIC)


def blob(im, box, color, alpha):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse(box, fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(40))
    im.alpha_composite(layer)


def cover(img, w, h):
    r = max(w / img.width, h / img.height)
    im = img.resize((max(1, int(img.width * r)), max(1, int(img.height * r))), Image.LANCZOS)
    left = (im.width - w) // 2
    top = max(0, (im.height - h) // 2)
    return im.crop((left, top, left + w, top + h))


def rounded(img, radius):
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, img.width - 1, img.height - 1], radius, fill=255)
    out = img.convert("RGBA")
    out.putalpha(mask)
    return out


def wrap(text, ft, max_w):
    lines, cur = [], ""
    for ch in text:
        if ch in "・/／" and ft.getlength(cur + ch) > max_w * 0.6:
            lines.append(cur + ch)
            cur = ""
            continue
        if ft.getlength(cur + ch) > max_w:
            lines.append(cur)
            cur = ch
        else:
            cur += ch
    if cur:
        lines.append(cur)
    return lines


def build(band):
    level = band["level"]
    im = bg().convert("RGBA")
    blob(im, (760, -180, 1320, 380), (190, 214, 255), 150)
    blob(im, (-160, 330, 420, 820), (214, 202, 250), 120)

    path = os.path.join(IMG_DIR, f"ketsudan-result-{level}.png")
    if os.path.exists(path):
        p = rounded(cover(Image.open(path).convert("RGB"), 470, 470), 40)
        im.alpha_composite(p, (690, 62))

    d = ImageDraw.Draw(im)

    # ロゴ
    for i, c in enumerate([(150, 176, 240), (196, 178, 240)]):
        for j in range(2):
            d.rounded_rectangle(
                [56 + i * 22, 44 + j * 22, 56 + i * 22 + 16, 44 + j * 22 + 16], 4, fill=c
            )
    d.text((110, 42), "ピクセルポップ", font=font(28), fill=NAVY)
    d.text((112, 76), "pixelpop.jp", font=font(18, "Medium"), fill=(120, 134, 170))

    d.text((60, 168), "13問でわかる！", font=font(38), fill=BLUE)
    d.text((60, 224), "あなたの決断力タイプは", font=font(42), fill=NAVY)

    tf = font(62, "Black")
    lines = wrap(band["title"], tf, 600)
    if len(lines) > 2:
        tf = font(48, "Black")
        lines = wrap(band["title"], tf, 600)
    y = 306
    for i, line in enumerate(lines):
        d.text((58, y + i * (tf.size + 10)), line, font=tf, fill=NAVY)

    bf = font(32)
    label = band["range"]
    tw = bf.getlength(label)
    by = y + (tf.size + 10) * len(lines) + 24
    d.rounded_rectangle([58, by, 58 + tw + 64, by + 62], 31, fill=PURPLE)
    d.text((90, by + 12), label, font=bf, fill=(255, 255, 255))

    d.rectangle([0, H - 74, W, H], fill=BAR)
    d.text((60, H - 52), "あなたの決断力も測ってみよう！", font=font(26, "Medium"), fill=(240, 244, 255))
    d.rounded_rectangle([760, H - 58, 1140, H - 16], 21, fill=(255, 255, 255))
    d.text((790, H - 48), "ピクセルポップ 決断力診断", font=font(24), fill=NAVY)

    out = os.path.join(OUT_DIR, f"{level}.jpg")
    im.convert("RGB").save(out, "JPEG", quality=84, optimize=True, progressive=True)
    return out


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for b in BANDS:
        print(build(b))
    build({"level": "default", "title": "あなたの決断力は何点？", "range": "13問の無料診断"})


if __name__ == "__main__":
    main()
