from PIL import Image
img = Image.open('src/assets/lgo.jpeg').convert('L')
img = img.point(lambda p: 0 if p > 128 else 255, '1')
img.save('logo.bmp')
