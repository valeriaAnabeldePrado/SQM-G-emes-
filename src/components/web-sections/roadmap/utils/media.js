const VIDEO_EXTENSIONS = /\.(mp4|webm|mov)$/i

export const isVideo = (src) => VIDEO_EXTENSIONS.test(src)

// Convención de nombres: /fundaciones/v1.mp4 -> /fundaciones/v1-poster.webp
export const posterFor = (src) => src.replace(VIDEO_EXTENSIONS, '-poster.webp')

export const countVideos = (items) => items.filter((item) => isVideo(item.src)).length

// "5 fotos", "10 piezas · 5 videos" — lo que el botón y el pie de la etapa necesitan decir
export const describeMedia = (items) => {
  const videos = countVideos(items)
  const photos = items.length - videos
  if (!videos) return `${photos} ${photos === 1 ? 'foto' : 'fotos'}`
  if (!photos) return `${videos} ${videos === 1 ? 'video' : 'videos'}`
  return `${photos} ${photos === 1 ? 'foto' : 'fotos'} · ${videos} ${videos === 1 ? 'video' : 'videos'}`
}
