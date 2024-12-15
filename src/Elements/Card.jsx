import React from "react";

function Card({document}) {
  return (
    <div>
      <div className="bg-gray-50 rounded-lg shadow-md p-5 flex flex-col md:flex-row justify-between items-start">
        <div className="w-full md:w-3/4">
        <h1 className=""> Owner</h1>
          <h3 className="text-xl font-semibold text-gray-800">
            {document.owner.username}
          </h3>
          <p className="mt-2 text-gray-600">
            {document.title}
          </p>
          <p className="mt-2 text-gray-600">
            {document.owner.email}
          </p>
        </div>
        <div className="w-full md:w-1/4 text-right mt-4 md:mt-0">
          <span className="block text-sm text-gray-500">Owner: User 1</span>
          <button className="mt-4 bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600">
            Request to Collaborate
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
