//importing CSS
import style from "../assets/css/image.module.css";

//importing image
import deleteBtn from "../assets/images/close.png";
import editBtn from "../assets/images/edit.png";


// -------------------------------IMAGE COMPONENT -------------------------------
export default function Image({ title, url, id, handleClick, deleteImageBtnClickHandler, editBtnClickHandler }) {
    return (
        <>
            <div className={`${style.imageTitleContainer} item-hover `} onClick={() => handleClick("", url)}>
                <img className={`${style.editBtn} btn-hover`} src={editBtn} onClick={(event) => editBtnClickHandler(event, id)} />
                <img className={`${style.deleteBtn} btn-hover`} src={deleteBtn} onClick={(event) => deleteImageBtnClickHandler(event, id)} />
                <div className={style.imageContainer}>
                    <img className={style.image} src={url} />
                </div>
                <p>{title}</p>
            </div>
        </>
    );
} 