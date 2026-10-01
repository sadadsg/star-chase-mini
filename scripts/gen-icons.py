#!/usr/bin/env python3
# 生成 tabBar 图标：81x81 PNG，普通态 #86868B / 选中态 #0071E3
# 4x 超采样抗锯齿后缩小。每次修改图标后运行：python3 scripts/gen-icons.py
from PIL import Image, ImageDraw
import os

S = 4                       # 超采样倍数
SIZE = 81 * S
STROKE = max(4, round(4.5 * S))
GRAY = (134, 134, 139, 255)  # #86868B
BLUE = (0, 113, 227, 255)    # #0071E3
OUT = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'miniprogram', 'images'))


def draw_home(d):
    d.line([(SIZE * 0.16, SIZE * 0.47), (SIZE * 0.5, SIZE * 0.18), (SIZE * 0.84, SIZE * 0.47)],
           fill=COLOR, width=STROKE, joint='curve')
    d.rounded_rectangle([SIZE * 0.24, SIZE * 0.44, SIZE * 0.76, SIZE * 0.82],
                        radius=int(7 * S), outline=COLOR, width=STROKE)
    d.rounded_rectangle([SIZE * 0.435, SIZE * 0.62, SIZE * 0.565, SIZE * 0.82],
                        radius=int(3 * S), outline=COLOR, width=STROKE)


def draw_news(d):
    d.rounded_rectangle([SIZE * 0.20, SIZE * 0.18, SIZE * 0.80, SIZE * 0.82],
                        radius=int(8 * S), outline=COLOR, width=STROKE)
    for y in (0.34, 0.48):
        d.line([(SIZE * 0.32, SIZE * y), (SIZE * 0.68, SIZE * y)], fill=COLOR, width=STROKE)
    d.line([(SIZE * 0.32, SIZE * 0.62), (SIZE * 0.52, SIZE * 0.62)], fill=COLOR, width=STROKE)


def draw_schedule(d):
    d.rounded_rectangle([SIZE * 0.18, SIZE * 0.24, SIZE * 0.82, SIZE * 0.82],
                        radius=int(7 * S), outline=COLOR, width=STROKE)
    for x in (0.34, 0.66):
        d.line([(SIZE * x, SIZE * 0.16), (SIZE * x, SIZE * 0.30)], fill=COLOR, width=STROKE)
    d.line([(SIZE * 0.18, SIZE * 0.40), (SIZE * 0.82, SIZE * 0.40)], fill=COLOR, width=STROKE)
    r = int(2.2 * S)
    for cx, cy in ((0.36, 0.54), (0.50, 0.54), (0.64, 0.54), (0.36, 0.68), (0.50, 0.68)):
        d.ellipse([SIZE * cx - r, SIZE * cy - r, SIZE * cx + r, SIZE * cy + r], fill=COLOR)


def draw_travel(d):
    # 纸飞机（发送/出行）
    pts = [(0.14, 0.44), (0.86, 0.18), (0.62, 0.82), (0.48, 0.58), (0.14, 0.44)]
    d.line([(SIZE * px, SIZE * py) for px, py in pts], fill=COLOR, width=STROKE, joint='curve')
    d.line([(SIZE * 0.48, SIZE * 0.58), (SIZE * 0.86, SIZE * 0.18)], fill=COLOR, width=STROKE)


ICONS = {
    'home': draw_home,
    'news': draw_news,
    'schedule': draw_schedule,
    'travel': draw_travel,
}

os.makedirs(OUT, exist_ok=True)
for name, painter in ICONS.items():
    for suffix, color in (('', GRAY), ('-active', BLUE)):
        globals()['COLOR'] = color
        img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
        painter(ImageDraw.Draw(img))
        img = img.resize((81, 81), Image.LANCZOS)
        path = os.path.join(OUT, f'{name}{suffix}.png')
        img.save(path)
        print(f'✓ {name}{suffix}.png')
