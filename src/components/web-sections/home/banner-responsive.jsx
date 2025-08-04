import BannerImage from '../../../assets/banner/mobile.png'

const BannerResponsive = () => {
  return (
    <div className="w-full h-[60vw] min-h-[300px] max-h-[600px] flex items-center justify-center min-d:hidden overflow-hidden">
      <img
        src={BannerImage}
        alt="Edificio SQM"
        className="w-full h-full object-cover object-center"
      />
    </div>
  )
}

export default BannerResponsive
