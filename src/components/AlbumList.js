//importing component
import Albums from "./Albums";
// importing CSS module for styling
import style from "../assets/css/albumList.module.css";



// -------------------ALBUM LIST COMPONENT-------------------------
export default function AlbumList({ albums, handleAlbumClick, handleDeleteClick }) {
    return (
        <>
            <div className={style.container}>
                <p>Your Albums</p>
                <div className={style.albumContainer}>
                    {albums.map((album) => <Albums key={album.id} name={album.name}
                        id={album.id} handleAlbumClick={handleAlbumClick} handleDeleteClick={handleDeleteClick} />)}
                </div>
            </div>

        </>
    );

}