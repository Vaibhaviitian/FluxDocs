import axios from "axios";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Card({ document }) {
  const owner = document.owner._id.toString();
  const user_id = localStorage.getItem("itemhai")?.toString() || "";
  const doc_id = document._id;
  const permission = "edit";
  let status="";

  const sending_request = async () => {
    // console.log(user_id, doc_id, "view");
    try {
      const response = await axios.post(
        "http://localhost:1000/api/collabs/sending_request",
        {
          user_id,
          doc_id,
          permission,
        }
      );
      console.log(response);
      status = response.data.status   
      toast.success(`${response?.data?.message}`);
    } catch (error) {
      console.log(error);
      toast.error("chud gaye");
    }

  };

  if (owner === user_id) {
    // console.log("Do not render if the document belongs to the current user");
    return null;
  }

  return (
    <div>
      <div className="bg-gray-50 rounded-lg shadow-md p-5 flex flex-col md:flex-row justify-between items-start">
        <div className="w-full md:w-3/4">
          <h1>Owner</h1>
          <h3 className="text-xl font-semibold text-gray-800">
            <b>Username:</b> {document?.owner?.username || "N/A"}
          </h3>
          <p className="mt-2 text-gray-600">
            <b>Doc Title:</b> {document.title || "Untitled"}
          </p>
          <p className="mt-2 text-gray-600">
            <b>Owner Email:</b> {document?.owner?.email || "N/A"}
          </p>
        </div>
        <div className="w-full md:w-1/4 text-right mt-4 md:mt-0">
          <span className="block text-sm text-gray-500">
            Owner: {document.owner.username || "N/A"}
          </span>
          <button
            className="mt-4 bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
            onClick={sending_request}
          >
            {status==="" ? <>Request to Collaborate</>: console.log(status) }
          </button>
        </div>
      </div>
      <ToastContainer/>
    </div>  
  );
}

export default Card;
