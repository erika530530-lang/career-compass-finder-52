"""
各診断（percent型）の結果ページ用OGP画像（1200x630）を一括生成するスクリプト。

使い方:
    bun scripts/dump-quizzes.ts      # 診断データを scripts/quizzes-og.json に書き出す
    python3 scripts/gen-og-quiz.py   # public/og/quiz/{quizId}/{level}.jpg を生成

デザインは scripts/gen-og-ketsudan.py と同系統（ピクセルポップ共通OGP）。
"""

import json
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "public", "images", "diagnoses", "result")
OUT_ROOT = os.path.join(ROOT, "public", "og", "quiz")
DATA = os.path.join(ROOT, "scripts", "quizzes-og.json")

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
        if ch in "・/／、" and ft.getlength(cur + ch) > max_w * 0.6:
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


def build(out_dir, level, headline, sub, badge, image_id):
    im = bg().convert("RGBA")
    blob(im, (760, -180, 1320, 380), (190, 214, 255), 150)
    blob(im, (-160, 330, 420, 820), (214, 202, 250), 120)

    if image_id:
        path = os.path.join(IMG_DIR, f"{image_id}.png")
        if os.path.exists(path):
            p = rounded(cover(Image.open(path).convert("RGB"), 470, 470), 40)
            im.alpha_composite(p, (690, 62))

    d = ImageDraw.Draw(im)

    for i, c in enumerate([(150, 176, 240), (196, 178, 240)]):
        for j in range(2):
            d.rounded_rectangle(
                [56 + i * 22, 44 + j * 22, 56 + i * 22 + 16, 44 + j * 22 + 16], 4, fill=c
            )
    d.text((110, 42), "ピクセルポップ", font=font(28), fill=NAVY)
    d.text((112, 76), "pixelpop.jp", font=font(18, "Medium"), fill=(120, 134, 170))

    d.text((60, 168), sub[0], font=font(36), fill=BLUE)
    sf = font(40)
    for line in wrap(sub[1], sf, 600)[:1]:
        d.text((60, 222), line, font=sf, fill=NAVY)

    tf = font(62, "Black")
    lines = wrap(headline, tf, 600)
    if len(lines) > 2:
        tf = font(46, "Black")
        lines = wrap(headline, tf, 600)[:3]
    y = 306
    for i, line in enumerate(lines):
        d.text((58, y + i * (tf.size + 10)), line, font=tf, fill=NAVY)

    bf = font(30)
    tw = bf.getlength(badge)
    by = min(y + (tf.size + 10) * len(lines) + 20, H - 150)
    d.rounded_rectangle([58, by, 58 + tw + 60, by + 58], 29, fill=PURPLE)
    d.text((88, by + 11), badge, font=bf, fill=(255, 255, 255))

    d.rectangle([0, H - 74, W, H], fill=BAR)
    d.text((60, H - 52), "きみもやってみる？", font=font(26, "Medium"), fill=(240, 244, 255))
    d.rounded_rectangle([760, H - 58, 1140, H - 16], 21, fill=(255, 255, 255))
    label = wrap("ピクセルポップ 無料診断", font(24), 340)[0]
    d.text((790, H - 48), label, font=font(24), fill=NAVY)

    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, f"{level}.jpg")
    im.convert("RGB").save(out, "JPEG", quality=84, optimize=True, progressive=True)
    return out


def main():
    quizzes = json.load(open(DATA, encoding="utf-8"))
    count = 0
    for q in quizzes:
        out_dir = os.path.join(OUT_ROOT, q["id"])
        bands = q["bands"]
        for idx, b in enumerate(bands):
            image_id = b.get("resultImageId")
            if not image_id or "-result-" not in image_id:
                continue
            level = image_id.split("-result-")[-1]
            upper = 100 if idx == 0 else bands[idx - 1]["min"] - 1
            badge = f"{q['metricLabel']} {b['min']}〜{upper}%"
            sub = (
                f"{q['questionCount']}問でわかる！",
                f"あなたの{q['metricLabel']}タイプは",
            )
            print(build(out_dir, level, b["title"], sub, badge, image_id))
            count += 1
        top = bands[0].get("resultImageId")
        print(
            build(
                out_dir,
                "default",
                q["title"],
                (f"{q['questionCount']}問でわかる！", "ピクセルポップの無料診断"),
                f"{q['metricLabel']}を測定",
                top,
            )
        )
        count += 1
    print(f"generated {count} images")


if __name__ == "__main__":
    main()
