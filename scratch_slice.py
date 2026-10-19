from PIL import Image
import os

os.makedirs('public/assets/products', exist_ok=True)

# 1. Product 001: Build Fail Learn Repeat (print_09.jpg - 1536x1024)
img9 = Image.open('public/assets/prints/print_09.jpg')
W, H = img9.size

# Front view
front9 = img9.crop((100, 30, 700, 620))
front9.save('public/assets/products/p01_front.jpg', quality=95)

# Back view (with BUILD. FAIL. LEARN. REPEAT.)
back9 = img9.crop((680, 30, 1240, 620))
back9.save('public/assets/products/p01_back.jpg', quality=95)

# Back graphic close-up
detail_back9 = img9.crop((1260, 240, 1536, 470))
detail_back9.save('public/assets/products/p01_detail_back.jpg', quality=95)

# Chest detail
detail_chest9 = img9.crop((1260, 30, 1536, 240))
detail_chest9.save('public/assets/products/p01_detail_chest.jpg', quality=95)

# Sleeve detail
detail_sleeve9 = img9.crop((1260, 470, 1536, 680))
detail_sleeve9.save('public/assets/products/p01_detail_sleeve.jpg', quality=95)

# 3/4 angle view (bottom right)
angle9 = img9.crop((940, 680, 1220, 960))
angle9.save('public/assets/products/p01_angle.jpg', quality=95)


# 2. Product 002: Lead Build Inspire (print_08.jpg - 1254x1254)
img8 = Image.open('public/assets/prints/print_08.jpg')
# Model front
p02_model = img8.crop((20, 20, 300, 420))
p02_model.save('public/assets/products/p02_model.jpg', quality=95)

# Model back with graphic
p02_back = img8.crop((310, 20, 600, 420))
p02_back.save('public/assets/products/p02_back.jpg', quality=95)

# Flat front
p02_front = img8.crop((50, 680, 310, 930))
p02_front.save('public/assets/products/p02_front.jpg', quality=95)

# Detail back typography
p02_detail_back = img8.crop((280, 430, 560, 650))
p02_detail_back.save('public/assets/products/p02_detail_back.jpg', quality=95)

# Detail chest
p02_detail_chest = img8.crop((20, 430, 280, 650))
p02_detail_chest.save('public/assets/products/p02_detail_chest.jpg', quality=95)


# 3. Product 003: Vision Over Validation (print_04.jpg - 1254x1254)
img4 = Image.open('public/assets/prints/print_04.jpg')
p03_front = img4.crop((10, 50, 300, 360))
p03_front.save('public/assets/products/p03_front.jpg', quality=95)

p03_back = img4.crop((320, 50, 620, 360))
p03_back.save('public/assets/products/p03_back.jpg', quality=95)

p03_detail_back = img4.crop((300, 370, 640, 620))
p03_detail_back.save('public/assets/products/p03_detail_back.jpg', quality=95)

p03_model = img4.crop((30, 620, 320, 980))
p03_model.save('public/assets/products/p03_model.jpg', quality=95)

p03_model_back = img4.crop((320, 620, 620, 980))
p03_model_back.save('public/assets/products/p03_model_back.jpg', quality=95)


# 4. Product 004: Struggle Builds Resilience (print_02.jpg - 1312x1199)
img2 = Image.open('public/assets/prints/print_02.jpg')
p04_front = img2.crop((20, 20, 450, 460))
p04_front.save('public/assets/products/p04_front.jpg', quality=95)

p04_back = img2.crop((460, 20, 890, 460))
p04_back.save('public/assets/products/p04_back.jpg', quality=95)

p04_detail_back = img2.crop((680, 470, 1020, 680))
p04_detail_back.save('public/assets/products/p04_detail_back.jpg', quality=95)


# 5. Product 005: Built Through Learning (print_03.jpg - 1311x1200)
img3 = Image.open('public/assets/prints/print_03.jpg')
p05_front = img3.crop((20, 30, 340, 350))
p05_front.save('public/assets/products/p05_front.jpg', quality=95)

p05_angle = img3.crop((350, 30, 660, 350))
p05_angle.save('public/assets/products/p05_angle.jpg', quality=95)

p05_back = img3.crop((1020, 30, 1290, 350))
p05_back.save('public/assets/products/p05_back.jpg', quality=95)

p05_detail_back = img3.crop((550, 710, 830, 890))
p05_detail_back.save('public/assets/products/p05_detail_back.jpg', quality=95)


# 6. Product 006: Dream Big Own Decision (print_01.jpg - 1254x1254)
img1 = Image.open('public/assets/prints/print_01.jpg')
p06_front = img1.crop((80, 30, 620, 470))
p06_front.save('public/assets/products/p06_front.jpg', quality=95)

p06_back = img1.crop((630, 30, 1180, 470))
p06_back.save('public/assets/products/p06_back.jpg', quality=95)

p06_detail_back = img1.crop((320, 490, 610, 700))
p06_detail_back.save('public/assets/products/p06_detail_back.jpg', quality=95)


# 7. Product 007: Vision Needs Execution (print_06.jpg - 1254x1254)
img6 = Image.open('public/assets/prints/print_06.jpg')
p07_front = img6.crop((15, 60, 310, 380))
p07_front.save('public/assets/products/p07_front.jpg', quality=95)

p07_back = img6.crop((690, 60, 990, 380))
p07_back.save('public/assets/products/p07_back.jpg', quality=95)

p07_detail_front = img6.crop((15, 430, 400, 740))
p07_detail_front.save('public/assets/products/p07_detail_front.jpg', quality=95)


# 8. Product 008: Trust The Process (print_05.jpg - 1254x1254)
img5 = Image.open('public/assets/prints/print_05.jpg')
p08_front = img5.crop((300, 20, 920, 560))
p08_front.save('public/assets/products/p08_front.jpg', quality=95)

p08_detail_front = img5.crop((20, 590, 430, 950))
p08_detail_front.save('public/assets/products/p08_detail_front.jpg', quality=95)

print("Sliced successfully!")
