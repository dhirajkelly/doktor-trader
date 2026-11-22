"""Remove only the white background that touches the frame border (keeps white shirt).
Usage: python3 host_alpha.py in_dir out_dir"""
import sys, os, glob
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
for p in sorted(glob.glob(os.path.join(src, '*.png'))):
    im = np.asarray(Image.open(p).convert('RGB')).astype(np.int16)
    white = (im.min(axis=2) > 225) & ((im.max(axis=2) - im.min(axis=2)) < 22)
    lab, _ = ndimage.label(white)
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    edge = edge[edge > 0]
    bg = np.isin(lab, edge)
    bg = ndimage.binary_opening(bg, iterations=1)
    alpha = Image.fromarray(((~bg) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    out = Image.fromarray(im.astype(np.uint8)).convert('RGBA')
    out.putalpha(alpha)
    out.save(os.path.join(dst, os.path.basename(p)))
