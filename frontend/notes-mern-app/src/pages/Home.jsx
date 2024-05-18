import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { MdAdd } from "react-icons/md";
import AndAndEditNote from "../components/AddAndEditNote";
import Modal from "react-modal";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContextProvider";
import  Loader  from "../components/Loader";

function Home() {
  const [openAddEditPopup, setOpenAddEditPopup] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const navigate = useNavigate();
  const { setUser } = useUser();
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleEditNote = (noteDetails) => {
    setOpenAddEditPopup({ isShown: true, type: "edit", data: noteDetails });
  };

  //? get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //? get all the notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occured, please try again");
    } finally {
      setLoading(false);
    }
  };

  //? delete note
  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An unexpected error occured, please try again");
      }
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []);

  // Function to format date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mt-20 flex justify-center items-center">
      <div className="flex justify-center items-center flex-col">
        <div className="flex justify-center items-center flex-wrap flex-col lg:flex-row lg:gap-4 mx-4">
          {allNotes.map((note) => (
            <Card
              key={note._id}
              title={note.title}
              date={formatDate(note.createdAt)}
              content={note.content}
              onEdit={() => handleEditNote(note)}
              onDelete={() => deleteNote(note)}
            />
          ))}
        </div>
        <div>
          <button
            className="bg-[#FFD700] rounded-full p-1 my-2"
            onClick={() => {
              setOpenAddEditPopup({ isShown: true, type: "add", data: null });
            }}
          >
            <MdAdd className="text-[28px]" />
          </button>
        </div>
      </div>

      <Modal
        isOpen={openAddEditPopup.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "#0B1215",
          },
        }}
        contentLabel=""
        className="mt-20 lg:w-[40%] w-[90%] max-h-3/4 mx-auto rounded-md"
        appElement={document.getElementById("root")}
      >
        <AndAndEditNote
          type={openAddEditPopup.type}
          noteData={openAddEditPopup.data}
          onClose={() => {
            setOpenAddEditPopup({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </div>
  );
}

export default Home;
