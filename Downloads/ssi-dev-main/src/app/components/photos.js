const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

const unsplashLink = (id, width, height) => `/images/cat${id}.jpg`;

const unsplashPhotos = [
  { id: 1, width: 1080, height: 800 },
  { id: 2, width: 920, height: 700 },
  { id: 3, width: 920, height: 800 },
  { id: 4, width: 1080, height: 750 },
  { id: 5, width: 1080, height: 500 },
  { id: 6, width: 1080, height: 607 },
  { id: 1, width: 1080, height: 800 },
  { id: 2, width: 920, height: 700 },
  { id: 3, width: 920, height: 800 },
  { id: 4, width: 1080, height: 750 },
  { id: 5, width: 1080, height: 500 },
  { id: 6, width: 1080, height: 607 },
];

const photos = unsplashPhotos.map((photo) => ({
  src: unsplashLink(photo.id, photo.width, photo.height),
  width: photo.width,
  height: photo.height,
  srcSet: breakpoints.map((breakpoint) => {
    const height = Math.round((photo.height / photo.width) * breakpoint);
    return {
      src: unsplashLink(photo.id, breakpoint, height),
      width: breakpoint,
      height,
    };
  }),
}));

export default photos;
