//importing css
import style from "../assets/css/addImageForm.module.css";

//importing image
import closeBtn from "../assets/images/close.png";

// -----------------------------ALBUM LIST------------------
export default function AddImageForm({ border, formSubmitHandler, formCloseBtnClickHandler, height, editImageData }) {
    return (
        <form onSubmit={formSubmitHandler} style={{ height: height, border: border }} className={style.form} >
            <p>Add Image</p>
            <input type="text" name="title" placeholder="Title.." defaultValue={editImageData ? editImageData.title : ""} />
            <input type="text" name="url" placeholder="URL.." defaultValue={editImageData ? editImageData.url : ""} />
            <input type="submit" value={editImageData ? "EDIT" : "ADD"} />
            <img src={closeBtn} className="btn-hover" onClick={formCloseBtnClickHandler} />

        </form>
    );
} 
