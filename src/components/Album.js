
//importing components
import AddImageForm from "./AddImageForm";
import Image from "./Image";

//importing HOOKS
import { useEffect, useReducer } from "react";

//importing images
import closeBtn from "../assets/images/close.png";
import addBtn from "../assets/images/add.png";
import backBtn from "../assets/images/back.png";


// importing toastr for notifications
import toastr from 'toastr';

//importing CSS module for styling
import style from "../assets/css/album.module.css";


//importing firebase
import db from "../firebaseInit";
import { collection, addDoc, updateDoc, onSnapshot, query, where, deleteDoc, doc } from "firebase/firestore";

//reducer FUNCTION
function reducer(state, action) {
    if (action.type === "FETCH") return { ...state, images: action.images };
    else if (action.type === "SHOW_POPUP") return { ...state, showPopup: true, imageUrl: action.url };
    else if (action.type === "CLOSE_POPUP") return { ...state, showPopup: false, imageUrl: null };
    else if (action.type === "OPEN_FORM") return { ...state, formHeight: "35vh", border: "3px solid white" };
    else if (action.type === "CLOSE_FORM") return { ...state, formHeight: 0, border: "none" };
    else if (action.type === "EDIT_IMAGE")
        return { ...state, formHeight: "35vh", border: "3px solid white", editImage: { id: action.id, title: action.title, url: action.url } };
    else if (action.type === "CLEAR_EDIT_FORM") return { ...state, formHeight: 0, border: "none", editImage: null };

    else return state;
}

// -------------------ALBUM COMPONENT---------------------

export default function Album({ album, name, backPressHandler }) {

    // --------------------------HOOKS-------------------------------
    const [state, dispatch] = useReducer(reducer, { images: [], showPopup: false, imageUrl: null, formHeight: 0, border: "none", editImage: null });

    useEffect(() => {
        //to get album data from firebase
        const q = query(collection(db, "Images"), where("album", "==", album));
        onSnapshot(q, (snapshot) => {
            const images = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Dispatch images to state
            dispatch({ type: "FETCH", images });
        });

    }, []);


    // -----------------------EVENT HANDLERS-----------------------

    async function formSubmitHandler(event) {
        event.preventDefault();

        //getting inputs from form
        const formData = new FormData(event.target);
        const title = formData.get("title").trim();
        const url = formData.get("url").trim();

        //if title is empty
        if (!title) return toastr.error("Invalid title")

        //is url is empty or url contains whitespace
        if (!url || url.includes(" ")) return toastr.error("Invalid URL");

        //to edit image
        if (state.editImage) {
            await updateImage(state.editImage.id, { title, url });
            return event.target.reset();
        }

        await addDoc(collection(db, "Images"), {
            //to make first letter of title uppercase
            title: title.charAt(0).toUpperCase() + title.slice(1),
            url: url,
            album,
            createdOn: new Date()
        });

        //to reset the from after submission
        event.target.reset();
    }

    //to update image in database
    async function updateImage(id, data) {
        try {
            await updateDoc(doc(db, "Images", id), data);
            toastr.success("Image updated successfully!");
            dispatch({ type: "CLEAR_EDIT_FORM" });


        } catch (error) {
            toastr.error("Error updating Image");
        }
    }

    //to edit an existing image in the database
    function editBtnClickHandler(event, id) {
        event.stopPropagation();
        const image = state.images.find((image) => image.id === id);
        dispatch({ type: "EDIT_IMAGE", id: id, title: image.title, url: image.url })

    }

    //event handler when clicked on a image
    function imageClickHandler(event, url) {
        dispatch({ type: "SHOW_POPUP", url });
    }

    //to close image popup
    function closeBtnClickHandler() {
        dispatch({ type: "CLOSE_POPUP" });
    }

    //to open the form to add new image
    function formOpenBtnClickHandler() {
        dispatch({ type: "OPEN_FORM", height: "25vh" });
    }

    //to close the form 
    function formCloseBtnClickHandler() {
        dispatch({ type: "CLOSE_FORM", height: 0 });
    }

    //to delete the image from thw database
    async function deleteImageBtnClickHandler(event, id) {
        try {
            event.stopPropagation();
            //to delete the album from the database
            await deleteDoc(doc(db, "Images", id));
            toastr.success("Image deleted successfully");

        } catch (error) {
            toastr.error("Error deleting Image");
            return;
        }
    }

    return (
        <>
            {/* ----------------------------ALBUM CONTAINER-------------------- */}
            <div className={style.albumNameContainer}>
                <img src={backBtn} onClick={backPressHandler} className="btn-hover" />
                <p>{name}</p>
                <img onClick={formOpenBtnClickHandler} src={addBtn} className="btn-hover" />
            </div>

            {/* -------------------------ADD IMAGE FORM---------------- */}
            <AddImageForm formSubmitHandler={formSubmitHandler} height={state.formHeight} formCloseBtnClickHandler={formCloseBtnClickHandler} border={state.border} editImageData={state.editImage} />

            {/* --------------------------IMAGES---------------------------- */}
            <div className={style.imagesContainer}>
                {state.images.length > 0 ? state.images.map(image => <Image url={image.url} key={image.id} id={image.id}
                    title={image.title} handleClick={imageClickHandler} deleteImageBtnClickHandler={deleteImageBtnClickHandler} editBtnClickHandler={editBtnClickHandler} />) : <p>No Images Found!!</p>}
            </div>

            {state.showPopup &&
                // ------------------------SHOW POPUP----------------------
                <div className={style.imagePopupContainer} onClick={closeBtnClickHandler}>
                    <div>
                        <img src={state.imageUrl} className={style.imagePopup} />
                        <img src={closeBtn} className={style.closeBtn} onClick={closeBtnClickHandler} />
                    </div>
                </div>
            }
        </>
    );
}