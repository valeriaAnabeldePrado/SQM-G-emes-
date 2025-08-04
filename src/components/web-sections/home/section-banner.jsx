import BannerImage from '../../../assets/banner/mobile.png'

const SectionBanner = () => {
  return (
    <div className="w-full h-[60vw] min-h-[400px] max-h-[800px]  items-center justify-center hidden min-d:flex overflow-hidden">
      <img
        src={BannerImage}
        alt="Edificio SQM"
        className="w-full h-full object-cover object-center"
      />
    </div>
  )
}

export default SectionBanner
