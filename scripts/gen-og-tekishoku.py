"""
てきしょく（職業診断）結果ページ用のOGP画像（1200x630）を生成するスクリプト。

使い方:
    python3 scripts/gen-og-tekishoku.py

- 職業データは scripts/careers-og.json（bun で src/lib/careers.ts から書き出し）
- 職業イラストは public/images/careers/{slug}.jpg
- 出力は public/og/tekishoku/{slug}.jpg
"""

import json
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "scripts", "careers-og.json")
IMG_DIR = os.path.join(ROOT, "public", "images", "careers")
OUT_DIR = os.path.join(ROOT, "public", "og", "tekishoku")

TTC = "/nix/store/722ld9djs9awdc7x0m2ppar493ajz1b0-noto-fonts-cjk-sans-2.004/share/fonts/opentype/noto-cjk/NotoSansCJK-VF.otf.ttc"

W, H = 1200, 630
NAVY = (24, 45, 106)
BLUE = (58, 106, 214)
PURPLE = (140, 116, 214)
BAR = (28, 46, 96)


def font(size, weight="Bold"):
    ft = ImageFont.truetype(TTC, size, index=0)
    ft.set_variation_by_name(weight)
    return ft


def bg():
    """淡いブルー→ラベンダーのやわらかい背景。"""
    small = Image.new("RGB", (12, 8))
    px = small.load()
    for y in range(8):
        for x in range(12):
            t = (x / 11 * 0.6) + (y / 7 * 0.4)
            px[x, y] = (
                int(252 - 14 * t),
                int(252 - 8 * t),
                int(255 - 2 * t),
            )
    return small.resize((W, H), Image.BICUBIC)


def blob(im, box, color, alpha):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse(box, fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(40))
    im.alpha_composite(layer)


def fit(text, max_w, start, min_size, weight="Black"):
    size = start
    while size > min_size:
        ft = font(size, weight)
        if ft.getlength(text) <= max_w:
            return ft
        size -= 2
    return font(min_size, weight)


def photo(slug):
    path = os.path.join(IMG_DIR, f"{slug}.jpg")
    if not os.path.exists(path):
        path = os.path.join(IMG_DIR, "default.jpg")
    return Image.open(path).convert("RGB")


def trim_black(img):
    """AI生成画像に入っている黒帯を取り除く。"""
    g = img.convert("L")
    W0, H0 = g.size
    def row_dark(y):
        return sum(g.getpixel((x, y)) for x in range(0, W0, 16)) / (W0 / 16) < 18
    def col_dark(x):
        return sum(g.getpixel((x, y)) for y in range(0, H0, 16)) / (H0 / 16) < 18
    top, bottom, left, right = 0, H0 - 1, 0, W0 - 1
    while top < bottom and row_dark(top):
        top += 1
    while bottom > top and row_dark(bottom):
        bottom -= 1
    while left < right and col_dark(left):
        left += 1
    while right > left and col_dark(right):
        right -= 1
    return img.crop((left, top, right + 1, bottom + 1))


def cover(img, w, h):
    img = trim_black(img)
    r = max(w / img.width, h / img.height)
    im = img.resize((max(1, int(img.width * r)), max(1, int(img.height * r))), Image.LANCZOS)
    left = (im.width - w) // 2
    top = max(0, int(im.height * 0.04))
    return im.crop((left, top, left + w, top + h))


def rounded(img, radius):
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, img.width - 1, img.height - 1], radius, fill=255)
    out = img.convert("RGBA")
    out.putalpha(mask)
    return out


def build(career):
    slug = career["slug"]
    im = bg().convert("RGBA")
    blob(im, (760, -180, 1320, 380), (190, 214, 255), 150)
    blob(im, (-160, 330, 420, 820), (214, 202, 250), 120)

    # 右側の職業イラスト
    pw, ph = 470, 470
    p = rounded(cover(photo(slug), pw, ph), 40)
    im.alpha_composite(p, (690, 62))

    d = ImageDraw.Draw(im)

    # ロゴ
    for i, c in enumerate([(150, 176, 240), (196, 178, 240)]):
        for j in range(2):
            d.rounded_rectangle([56 + i * 22, 44 + j * 22, 56 + i * 22 + 16, 44 + j * 22 + 16], 4, fill=c)
    d.text((110, 42), "ピクセルポップ", font=font(28), fill=NAVY)
    d.text((112, 76), "pixelpop.jp", font=font(18, "Medium"), fill=(120, 134, 170))

    # 訴求
    d.text((60, 168), "10問でわかる！", font=font(38), fill=BLUE)
    d.text((60, 224), "あなたに向いている職業は", font=font(42), fill=NAVY)

    # 職業名（最大サイズで目立たせる）
    name = career["name"]
    nf = fit(name, 600, 118, 46)
    d.text((58, 300), name, font=nf, fill=NAVY)

    # タイプのバッジ
    label = career["type"]
    bf = font(32)
    tw = bf.getlength(label)
    by = 300 + nf.size + 40
    d.rounded_rectangle([58, by, 58 + tw + 64, by + 62], 31, fill=PURPLE)
    d.text((90, by + 12), label, font=bf, fill=(255, 255, 255))

    # 下部のCTAバー
    d.rectangle([0, H - 74, W, H], fill=BAR)
    d.text((60, H - 52), "他の職業タイプも診断してみよう！", font=font(26, "Medium"), fill=(240, 244, 255))
    d.rounded_rectangle([760, H - 58, 1140, H - 16], 21, fill=(255, 255, 255))
    d.text((790, H - 48), "ピクセルポップ 職業診断", font=font(24), fill=NAVY)

    out = os.path.join(OUT_DIR, f"{slug}.jpg")
    im.convert("RGB").save(out, "JPEG", quality=84, optimize=True, progressive=True)
    return out


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    careers = json.load(open(DATA, encoding="utf-8"))
    for c in careers:
        build(c)
    # デフォルト（職業が特定できないとき用）
    build({"slug": "default", "name": "向いてる職業", "type": "全71職種から診断"})
    print(f"generated {len(careers) + 1} images")


if __name__ == "__main__":
    main()
