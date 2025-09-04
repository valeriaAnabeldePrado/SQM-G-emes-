import { MdClose, MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md'

const ModalGallery = ({
  selectedImages,
  currentImageIndex,
  onClose,
  onPrevImage,
  onNextImage,
  placeholderImage
}) => {
  if (!selectedImages) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar galería"
          className="absolute top-3 right-3 z-10 bg-white text-[var(--color-three)] rounded-full p-2 shadow-lg hover:scale-105 transition-all duration-200"
        >
          <MdClose size={22} />
        </button>

        {/* Navigation Buttons */}
        {selectedImages.length > 1 && (
          <>
            <button
              onClick={onPrevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-300"
            >
              <MdArrowBackIos size={24} className="text-white" />
            </button>
            <button
              onClick={onNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-300"
            >
              <MdArrowForwardIos size={24} className="text-white" />
            </button>
          </>
        )}

        {/* Main Image */}
        <img
          src={selectedImages[currentImageIndex]}
          alt="Avance de obra"
          onError={(e) => (e.currentTarget.src = placeholderImage)}
          className="max-w-full max-h-full object-contain rounded-lg bg-gray-900"
        />

        {/* Image Counter */}
        {selectedImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {selectedImages.length}
          </div>
        )}
      </div>
    </div>
  )
}

export default ModalGallery
