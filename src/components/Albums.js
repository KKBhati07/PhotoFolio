//importing CSS
import style from "../assets/css/albums.module.css";

//importing image
import albumIcon from "../assets/images/album-icon.png";
import deleteBtn from "../assets/images/close.png";

// --------------------ALBUMS COMPONENT------------------
export default function Albums({ name, id, handleAlbumClick, handleDeleteClick }) {
    return (
        <>
            <div className={`${style.container} item-hover`} onClick={() => handleAlbumClick(id, name)} >
                <img className={style.albumCover} src={albumIcon} ></img>
                <img className={style.deleteBtn} src={deleteBtn} onClick={(event) => handleDeleteClick(event, id)} />
                <p onClick={() => handleAlbumClick(id)} className={style.albumName} >{name}</p>
            </div>
        </>
    );
}