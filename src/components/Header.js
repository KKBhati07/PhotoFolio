//importing CSS
import style from "../assets/css/header.module.css";

//importing image
import icon from "../assets/images/album.png";



// ----------------------HEADER MODULE------------------
export default function Header() {

    return (
        <>
            <header className={style.header}>
                <img className={style.icon} src={icon} />
                <h2 className={style.heading}>PhotoFolio</h2>
            </header>
        </>
    );
}
