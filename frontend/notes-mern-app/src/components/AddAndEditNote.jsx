import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import axiosInstance from "../utils/axios";

function AndAndEditNote({ type, noteData, getAllNotes, onClose }) {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [error, setError] = useState(null);

  //! Add the note
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
      });

      if (response.data && response.data.note) {
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  //! Edit the note
  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.patch("/edit-note/" + noteId, {
        title,
        content,
      });

      if (response.data && response.data.note) {
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  //! Add note
  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="mt-10 bg-white p-4 rounded">
      <div className="flex flex-col gap-4 relative">
        <div className="">
          <button
            className="flex justify-center items-center size-10 rounded-full absolute -top-3 -right-3"
            onClick={onClose}
          >
            <MdClose className="text-lg" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <label className="w-full font-semibold text-lg" htmlFor="">
            Title
          </label>
          <input
            className="p-2 bg-transparent border border-borderColor"
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="Enter Your Title"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="w-full font-semibold text-lg" htmlFor="">
            Content
          </label>
          <textarea
            className="p-2 bg-transparent border border-borderColor"
            type="text"
            value={content}
            onChange={({ target }) => setContent(target.value)}
            placeholder="Add Your Content ..."
            rows={10}
          />
        </div>

        {error && <p className="text-alertColor text-xs pt-4">{error}</p>}

        <button
          className="py-2 w-full bg-secondary text-white font-medium rounded"
          onClick={handleAddNote}
        >
          {type === "edit" ? "UPDATE" : "ADD"}
        </button>
      </div>
    </div>
  );
}

export default AndAndEditNote;
