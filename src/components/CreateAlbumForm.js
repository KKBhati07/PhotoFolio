// importing CSS module
import style from "../assets/css/createAlbumForm.module.css";



// ----------------------CREATE ALBUM FORM COMPONENT------------------

export default function CreateAlbum({ onFormSubmit, formHeight }) {


    return (
        <>
            <form className={style.form} onSubmit={onFormSubmit} style={{ height: formHeight }}>
                <input className={`form-item-hover`} name="name" placeholder="Album name.." />
                <input className={`${style.input} form-item-hover`} type="submit" value="Create Album" />

            </form>
        </>
    );
}