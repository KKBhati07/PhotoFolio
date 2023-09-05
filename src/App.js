//importing toastr CSS
import 'toastr/build/toastr.min.css';
//importing CSS module
import './App.css';
//importing hooks
import { useReducer, useEffect } from 'react';

//importing components
import Header from './components/Header';
import CreateAlbumForm from './components/CreateAlbumForm';
import AlbumList from './components/AlbumList';
import Album from './components/Album';


// importing toastr for notifications
import toastr from 'toastr';

//importing image
import addBtn from "./assets/images/add.png";


//importing firebase
import db from "./firebaseInit";
import { collection, addDoc, deleteDoc, getDocs, where, onSnapshot, query, doc } from "firebase/firestore";

//REDUCER FUNCTION FOR useReducer HOOK
function reducer(state, action) {
  if (action.type === "FETCH") return { ...state, albums: action.albums };

  else if (action.type === "SELECT_ALBUM")
    return { ...state, selectedAlbum: action.album, albumName: action.albumName };

  else if (action.type === "OPEN_FORM") return { ...state, openForm: false, formHeight: "30vh" };
  else if (action.type === "CLOSE_FORM") return { ...state, openForm: true, formHeight: 0 };
  else if (action.type === "BACK_PRESS") return { ...state, selectedAlbum: null, albumName: null };
  else return state;

}


function App() {
  // --------------------------------------REACT HOOKS--------------------------------

  const [state, dispatch] = useReducer(reducer, { albums: [], selectedAlbum: null, albumName: null, openForm: true, formHeight: "0vh" });

  useEffect(() => {
    //SETTING TOASTR FOR NOTIFICATIONS
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": true,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "3000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut",
      "opacity": "1"
    };
  }, []);


  //to fetch data from firebase
  useEffect(() => {
    const ubSub = onSnapshot(collection(db, "Albums"), (snapshot) => {
      let albums = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      });
      dispatch({ type: "FETCH", albums });
    })
  }, []);



  // ----------------------------------EVENT HANDLERS--------------------------------


  //from submit handler to create album
  async function onFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const albumName = formData.get('name').trim();
    //if the name is empty
    if (!albumName) return toastr.error("Name cannot be empty");
    //if the name is more than 10 characters
    if (albumName.length > 10) return toastr.error("Name cannot be more than 10 characters!");

    //to add the album to the database
    await addDoc(collection(db, "Albums"), {
      name: albumName.charAt(0).toUpperCase() + albumName.slice(1),
      createdOn: new Date()
    });
    //to show notification
    toastr.success("Album added successfully");
    //to reset the form
    event.target.reset();

  }

  //to handle the click on a album
  function handleAlbumClick(album, albumName) {
    dispatch({ type: "SELECT_ALBUM", album, albumName });
  }

  //to delete an album
  async function handleDeleteClick(event, id) {
    try {
      event.stopPropagation();

      //to delete the images associated with the albums
      const queryData = await getDocs(
        query(collection(db, "Images"), where("album", "==", id))
      );

      // Delete each image
      const deleteImages = queryData.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      });
      await Promise.all(deleteImages);


      //to delete the album from the database
      await deleteDoc(doc(db, "Albums", id));
      toastr.success("Album deleted successfully");

      //if there is problem in deleting the album from the database
    } catch (error) {
      return toastr.error("Error deleting album");
    }

  }

  //to handle back press
  function backPressHandler() {
    dispatch({ type: "BACK_PRESS", });

  }

  //to open the form
  function openFormBtnClickHandler() {
    if (state.openForm) return dispatch({ type: "OPEN_FORM" });
    dispatch({ type: "CLOSE_FORM" });
  }

  return (
    <>
      {/* ---------------------HEADER----------------- */}
      <Header />

      {/* ------------------MAIN CONTAINER------------------ */}
      <main className="main-container">
        {!state.selectedAlbum ?

          (<>

            {/* -----------------------CREATE ALBUM FORM-------------------- */}
            <div className="create-album-from-container">
              <div onClick={openFormBtnClickHandler}>

                <h2 >Create Album</h2>
                <img src={addBtn} className="item-hover" onClick={openFormBtnClickHandler} style={state.openForm ? { rotate: "0deg" } : { rotate: "45deg" }} />
              </div>

              <CreateAlbumForm onFormSubmit={onFormSubmit} formHeight={state.formHeight} />
            </div>

            {/* ------------------ALBUM LIST-------------------- */}
            <AlbumList albums={state.albums} handleAlbumClick={handleAlbumClick} handleDeleteClick={handleDeleteClick} />
          </>) : (

            // -------------------------ALBUM-----------------
            <Album album={state.selectedAlbum} name={state.albumName} backPressHandler={backPressHandler} />
          )
        }
      </main>

    </>
  );
}

//exporting app component
export default App;
