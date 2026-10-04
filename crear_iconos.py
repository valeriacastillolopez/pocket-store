# pip install pillow para generar iconos
from PIL import Image, ImageDraw

def crear_icono(size, ruta):
    img = Image.new("RGB", (size, size), "#db2777")
    d = ImageDraw.Draw(img)
    s = size
    d.rounded_rectangle([s*0.25, s*0.38, s*0.75, s*0.80], radius=s*0.06, fill="white")
    d.arc([s*0.36, s*0.20, s*0.64, s*0.56], start=180, end=360, fill="white", width=max(2, int(s*0.05)))
    img.save(ruta)

crear_icono(192, "icons/icon-192.png")
crear_icono(512, "icons/icon-512.png")
print("Iconos creados")
