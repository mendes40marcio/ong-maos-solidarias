"""Converte fotos reais (baixadas do Unsplash/Pexels) para JPG + WebP otimizados.
Uso: coloque as fotos originais na pasta fotos-originais/ com os nomes
voluntarios.*, educacao.*, alimentacao.*, inclusao.* e rode:  python3 otimizar-imagens.py
Requer: pip install pillow
"""
from pathlib import Path
from PIL import Image, ImageOps
TAMANHOS = {"voluntarios": (1200, 675), "educacao": (800, 500), "alimentacao": (800, 500), "inclusao": (800, 500)}
orig = Path("fotos-originais"); dest = Path("img"); dest.mkdir(exist_ok=True)
for f in orig.iterdir():
    nome = f.stem.lower()
    if nome not in TAMANHOS: continue
    im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
    im = ImageOps.fit(im, TAMANHOS[nome], Image.LANCZOS)   # corta/redimensiona mantendo o centro
    im.save(dest / f"{nome}.jpg", quality=82, optimize=True, progressive=True)
    im.save(dest / f"{nome}.webp", quality=76, method=6)
    print(f"ok: {nome} -> {TAMANHOS[nome]}")
