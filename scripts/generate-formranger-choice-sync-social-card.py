from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "formranger-choices-from-sheets-card.png"
W, H = 1200, 630

FONT = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")


def f(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT), size)


def text(draw: ImageDraw.ImageDraw, xy, value: str, size: int, fill: str, bold: bool = False, anchor: str | None = None):
    draw.text(xy, value, font=f(size, bold), fill=fill, anchor=anchor)


def round_rect(draw: ImageDraw.ImageDraw, box, radius: int, fill: str, outline: str | None = None, width: int = 1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def wrap(draw: ImageDraw.ImageDraw, value: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    lines: list[str] = []
    line = ""
    for word in value.split():
        candidate = f"{line} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=font)[2] <= max_width:
            line = candidate
            continue
        if line:
            lines.append(line)
        line = word
    if line:
        lines.append(line)
    return lines


def main() -> int:
    img = Image.new("RGB", (W, H), "#08090a")
    draw = ImageDraw.Draw(img)

    for x in range(72, 1130, 54):
        draw.line((x, 62, x, 568), fill="#101317", width=1)
    for y in range(62, 568, 54):
        draw.line((72, y, 1130, y), fill="#101317", width=1)

    round_rect(draw, (70, 60, 1130, 570), 28, "#111316", "#252a33", 2)
    round_rect(draw, (102, 94, 268, 132), 10, "#1b2140", "#333a71")
    text(draw, (122, 102), "FormRanger guide", 20, "#d7dcff", True)

    text(draw, (102, 194), "Google Forms choices", 52, "#f7f8f8", True)
    text(draw, (102, 252), "from Google Sheets", 52, "#f7f8f8", True)

    body = "Use Sheets as the source for dropdown, multiple-choice, checkbox, and grid choices. Test one mapping before launching."
    y = 332
    for line in wrap(draw, body, f(25), 586):
        text(draw, (104, y), line, 25, "#b7bec9")
        y += 34

    x0, y0 = 735, 114
    round_rect(draw, (x0, y0, 1072, y0 + 120), 18, "#161a20", "#303744")
    text(draw, (x0 + 24, y0 + 24), "Google Sheet", 23, "#f7f8f8", True)
    text(draw, (x0 + 24, y0 + 66), "Session", 19, "#b7bec9")
    text(draw, (x0 + 134, y0 + 66), "Workshop A", 19, "#10b981", True)
    text(draw, (x0 + 134, y0 + 94), "Workshop B", 19, "#10b981", True)

    round_rect(draw, (x0, y0 + 168, 1072, y0 + 288), 18, "#161a20", "#303744")
    text(draw, (x0 + 24, y0 + 192), "FormRanger", 23, "#f7f8f8", True)
    text(draw, (x0 + 24, y0 + 236), "Preflight -> Update now", 19, "#b7bec9")

    round_rect(draw, (x0, y0 + 336, 1072, y0 + 456), 18, "#161a20", "#303744")
    text(draw, (x0 + 24, y0 + 360), "Google Form", 23, "#f7f8f8", True)
    text(draw, (x0 + 24, y0 + 404), "Public preview shows choices", 19, "#b7bec9")

    for yy in [y0 + 132, y0 + 300]:
        draw.line((904, yy, 904, yy + 26), fill="#5e6ad2", width=4)
        draw.polygon([(904, yy + 42), (894, yy + 26), (914, yy + 26)], fill="#5e6ad2")

    round_rect(draw, (102, 466, 406, 520), 14, "#5e6ad2")
    text(draw, (254, 493), "formsuite.dev/formranger", 22, "#ffffff", True, "mm")
    text(draw, (102, 546), "Not booking. Not inventory locking. Built for a safe choice-sync workflow.", 17, "#8b93a0")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, optimize=True)
    print(f"{OUT} {img.size[0]}x{img.size[1]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
