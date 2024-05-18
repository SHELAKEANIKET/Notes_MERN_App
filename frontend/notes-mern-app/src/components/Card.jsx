import React, { useEffect, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
function Card({ title, date, content, onEdit, onDelete }) {

  const colors = [
    "bg-red-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-indigo-100",
    "bg-purple-100",
    "bg-pink-100"
  ];
  
  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);
  }, []);

  return (
    <div className={`${bgColor} w-[80vw] lg:w-[520px] p-4 rounded-lg my-2 mx-4`}>
      <div>
        <h2 className="text-xl capitalize font-semibold">{title}</h2>
        <p className="text-base font-medium ">Date: {date}</p>
      </div>
      <div className="py-2">
        <p>{content}</p>
      </div>
      <div className="flex justify-end items-center gap-4">
        <div><MdEdit className="cursor-pointer size-5 text-yellow-600" onClick={onEdit}/></div>
        <div><MdDelete className="cursor-pointer size-5 text-red-500" onClick={onDelete}/></div>
      </div>
    </div>
  );
}

export default Card;
