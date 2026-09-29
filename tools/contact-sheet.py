from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont
root=Path(__file__).resolve().parents[1]
assets=json.loads((root/'asset-manifest.json').read_text(encoding='utf-8'))['assets']
font=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',22)
title=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',40)
small=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',19)
canvas=Image.new('RGB',(2520,1860),'#09151f');d=ImageDraw.Draw(canvas)
d.text((42,30),'雨町 · 26 种街区建筑素材',font=title,fill='#e2d5b9');d.text((44,91),'20 家店铺 + 公寓 / 住宅 / 诊所 / 邮局 / 打烊门面 / 口袋神社',font=small,fill='#98aeb3')
for i,a in enumerate(assets):
    x=35+(i%6)*414;y=144+(i//6)*337
    im=Image.open(root/a['preview']).convert('RGB').crop((390,245,1430,1110)).resize((397,286),Image.Resampling.LANCZOS)
    canvas.paste(im,(x,y));d.line((x,y+287,x+397,y+287),fill='#2e454f');d.text((x+6,y+298),f'{i+1:02d}  {a["name"]}',font=font,fill='#ccbea3')
canvas.save(root/'previews'/'26种建筑素材总览.png')
# A second contact sheet lets the viewer see both aerial organization and everyday street scale.
result=Image.new('RGB',(2400,1650),'#09151f');dr=ImageDraw.Draw(result);dr.text((40,25),'雨町 · 完整街区与街道视角',font=title,fill='#e2d5b9')
for p,(filename,label) in enumerate([('00_完整街区全景.png','33 栋建筑 / 街区全景'),('01_商店街视角.png','双侧商店街'),('02_十字路口.png','十字路口与店铺'),('03_住宅后巷.png','住宅后巷')]):
    x=30+(p%2)*1190;y=110+(p//2)*750
    im=Image.open(root/'previews'/filename).convert('RGB')
    if p==0: im=im.crop((150,150,1690,1100))
    else: im=im.crop((0,40,1800,1170))
    im=im.resize((1160,682),Image.Resampling.LANCZOS);result.paste(im,(x,y));dr.text((x+8,y+695),label,font=font,fill='#cbbca0')
result.save(root/'previews'/'街区场景总览.png')
print('Saved two overview sheets.')
