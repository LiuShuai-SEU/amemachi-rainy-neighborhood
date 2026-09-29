from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path(__file__).resolve().parents[1]
destination=root.parent/'雨町完整街区_33栋建筑可编辑素材包.zip'
with ZipFile(destination,'w',ZIP_DEFLATED,compresslevel=6) as archive:
    for file in sorted(root.rglob('*')):
        if not file.is_file(): continue
        relative=file.relative_to(root)
        if any(part in {'node_modules','dist','.git','__pycache__'} for part in relative.parts) or file.suffix=='.log': continue
        archive.write(file,Path(root.name)/relative)
with ZipFile(destination) as archive:
    assert archive.testzip() is None
    print(f'Archive: {destination.name} / {len(archive.namelist())} files / {destination.stat().st_size} bytes / CRC OK')
