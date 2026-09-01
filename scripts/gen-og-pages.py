"""
トップページ・一覧ページ・各ミニゲームページ用のOGP画像（1200x630）を生成するスクリプト。

使い方:
    python3 scripts/gen-og-pages.py

- 出力は public/og/pages/{key}.jpg
- デザインは scripts/gen-og-quiz.py と同系統（ピクセルポップ共通OGP）
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "og", "pages")

TTC = "/nix/store/722ld9djs9awdc7x0m2ppar493ajz1b0-noto-fonts-cjk-sans-2.004/share/fonts/opentype/noto-cjk/NotoSansCJK-VF.otf.ttc"

W, H = 1200, 630
NAVY = (24, 45, 106)
BLUE = (58, 106, 214)
PURPLE = (140, 116, 214)
BAR = (28, 46, 96)

PAGES = [
    {
        "key": "home",
        "sub": ("登録不要・全部無料", "診断・クイズ・ミニゲーム"),
        "headline": "暇つぶしが、\nちょっと楽しくなる",
        "badge": "1分から遊べる",
        "cta": "ピクセルポップで遊ぶ",
        "image": "images/diagnoses/thumb/default.jpg",
    },
    {
        "key": "quizzes",
        "sub": ("全17種類以上", "気になるテーマから選べる"),
        "headline": "あなたのこと、\n診断してみる？",
        "badge": "人気順・新着順で探せる",
        "cta": "ピクセルポップ 診断一覧",
        "image": "images/diagnoses/thumb/cat-personality.jpg",
    },
    {
        "key": "games",
        "sub": ("知識・言葉・地理", "遊ぶだけで賢くなる"),
        "headline": "ミニゲームで\n頭の体操しよう",
        "badge": "毎回ランダム10問",
        "cta": "ピクセルポップ ゲーム一覧",
        "image": "images/games/thumb/default.jpg",
    },
    {
        "key": "game-kanji",
        "sub": ("約150問からランダム出題", "むかしの絵から漢字を当てる"),
        "headline": "この象形文字、\n何の漢字？",
        "badge": "ヒント2段階つき",
        "cta": "ピクセルポップ 象形文字クイズ",
        "image": "images/games/thumb/kanji-glyph.jpg",
    },
    {
        "key": "game-kokki",
        "sub": ("165か国から出題", "国旗を見て国名を推理"),
        "headline": "この国、\nわかる？",
        "badge": "ひらがな入力でもOK",
        "cta": "ピクセルポップ 国名当てクイズ",
        "image": "images/games/thumb/flag-country.jpg",
    },
    {
        "key": "game-kotowaza",
        "sub": ("102問の由来クイズ", "故事・背景から4択で当てる"),
        "headline": "この由来、\nどのことわざ？",
        "badge": "解説・豆知識つき",
        "cta": "ピクセルポップ ことわざクイズ",
        "image": "images/games/thumb/proverb-origin.jpg",
    },
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
        if ft.getlength(cur + ch) > max_w:
            lines.append(cur)
            cur = ch
        else:
            cur += ch
    if cur:
        lines.append(cur)
    return lines


def build(page):
    im = bg().convert("RGBA")
    blob(im, (760, -180, 1320, 380), (190, 214, 255), 150)
    blob(im, (-160, 330, 420, 820), (214, 202, 250), 120)

    path = os.path.join(ROOT, "public", page["image"])
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

    d.text((60, 168), page["sub"][0], font=font(36), fill=BLUE)
    sf = font(38)
    d.text((60, 222), wrap(page["sub"][1], sf, 600)[0], font=sf, fill=NAVY)

    tf = font(62, "Black")
    lines = []
    for part in page["headline"].split("\n"):
        lines.extend(wrap(part, tf, 600))
    if len(lines) > 2:
        tf = font(50, "Black")
        lines = []
        for part in page["headline"].split("\n"):
            lines.extend(wrap(part, tf, 600))
    y = 306
    for i, line in enumerate(lines):
        d.text((58, y + i * (tf.size + 10)), line, font=tf, fill=NAVY)

    bf = font(30)
    tw = bf.getlength(page["badge"])
    by = min(y + (tf.size + 10) * len(lines) + 20, H - 150)
    d.rounded_rectangle([58, by, 58 + tw + 60, by + 58], 29, fill=PURPLE)
    d.text((88, by + 11), page["badge"], font=bf, fill=(255, 255, 255))

    d.rectangle([0, H - 74, W, H], fill=BAR)
    d.text((60, H - 52), "きみもやってみる？", font=font(26, "Medium"), fill=(240, 244, 255))
    d.rounded_rectangle([740, H - 58, 1140, H - 16], 21, fill=(255, 255, 255))
    cf = font(24)
    label = page["cta"]
    while cf.getlength(label) > 360 and cf.size > 16:
        cf = font(cf.size - 2)
    d.text((760 + (380 - cf.getlength(label)) / 2, H - 50), label, font=cf, fill=NAVY)

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, f"{page['key']}.jpg")
    im.convert("RGB").save(out, "JPEG", quality=84, optimize=True, progressive=True)
    return out


def main():
    for p in PAGES:
        print(build(p))
    print(f"generated {len(PAGES)} images")


if __name__ == "__main__":
    main()
