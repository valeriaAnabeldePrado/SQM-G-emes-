import PhotoAlbum from "react-photo-album";
import photos from "./photos";

const photoStyle = { objectFit: "cover" };
export default function App() {
  return <PhotoAlbum photos={photos} layout="rows" photoStyle={photoStyle} />;
}
