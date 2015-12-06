from PIL import Image

if __name__ == "__main__":
    infile = "favicon.orig.png"
    outfile = {
        "android-chrome-512x512.png": (512, 512),
        "android-chrome-384x384.png": (384, 384),
        "android-chrome-256x256.png": (256, 256),
        "android-chrome-192x192.png": (192, 192),
        "android-chrome-144x144.png": (144, 144),
        "android-chrome-36x36.png": (36, 36),
        "android-chrome-48x48.png": (48, 48),
        "android-chrome-72x72.png": (72, 72),
        "android-chrome-96x96.png": (96, 96),
        "apple-touch-icon-114x114.png": (114, 114),
        "apple-touch-icon-120x120.png": (120, 120),
        "apple-touch-icon-144x144.png": (144, 144),
        "apple-touch-icon-152x152.png": (152, 152),
        "apple-touch-icon-180x180.png": (180, 180),
        "apple-touch-icon-57x57.png": (57, 57),
        "apple-touch-icon-60x60.png": (60, 60),
        "apple-touch-icon-72x72.png": (72, 72),
        "apple-touch-icon-76x76.png": (76, 76),
        "apple-touch-icon.png": (180, 180),
        "apple-touch-icon-precomposed.png": (180, 180),
        "favicon-16x16.png": (16, 16),
        "favicon-32x32.png": (32, 32),
        "favicon-96x96.png": (96, 96),
        "favicon.ico": (48, 48),
        "mstile-144x144.png": (144, 144),
        "mstile-150x150.png": (150, 150),
        "mstile-310x150.png": (310, 150),
        "mstile-310x310.png": (310, 310),
        "mstile-70x70.png": (70, 70),
    }

    orig = Image.open(infile)

    for filename, size in outfile.iteritems():
        try:
            im = orig.copy()
            im.thumbnail(size, Image.ANTIALIAS)
            im.save(filename, "PNG")
        except IOError:
            print "cannot create thumbnail for '%s'" % infile
