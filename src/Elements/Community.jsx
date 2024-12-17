import React, { useEffect, useState } from "react";
import Card from "./Card.jsx";
import axios from "axios";

function Community() {
  const [data, setdata] = useState([]);

  // Function to fetch all documents
  const getting_alldocs = async () => {
    try {
      const response = await axios.get("http://localhost:1000/api/collabs/all_docs");
      if (response) {
        setdata(response.data.data);
      }
      // console.log(response);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    getting_alldocs();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
        <div className="bg-teal-600 text-white p-6 rounded-t-lg">
          <h2 className="text-3xl font-semibold text-center">
            FluxDocs Collaboration Community
          </h2>
          <p className="mt-2 text-lg text-center">
            Explore documents and collaborate with your friends
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {data.map((doc) => (
              <Card key={doc._id} document={doc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;
