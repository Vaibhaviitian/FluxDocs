import React, { useEffect, useState } from "react";
import Card from "./Card.jsx";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Community() {
  const [data, setdata] = useState([]);
  const [query, setQuery] = useState("");
  const [queryloading, setQueryloading] = useState(false);
  const [batabe,setBatabe] = useState(false);
  // Function to fetch all documents
  const getting_alldocs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:1000/api/collabs/all_docs"
      );
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
  const searchquery = (e) => {
    e.preventDefault();
    setQueryloading(true);
    if (query.toString() == "") {
      toast.error("search box is empty");
      setQueryloading(false);
      return;
    }
    // console.log("data:", data); // Logs the value of data
    let foundMatch = false; 
    data.map((card) => {
      // console.log(card);
      if (card.owner && card.owner.email && card.owner.username) {
        let title = card.title;
        let owner = card.owner.email;
        let username = card.owner.username;
        // console.log(title, owner, username);
        if (
          query.includes(title) ||
          query.includes(owner) ||
          query.includes(username)
        ) {
          foundMatch=true;
          setBatabe(true);
          console.log("yessssss");
          toast.success("Query found!")
        }
      }
      setQueryloading(false);
    });
    // console.log(query);
    if (!foundMatch) {
      console.log(foundMatch);
      toast.error("Query Not found");
    }
  };
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
          <form class="d-flex" role="search">
            <div class="flex items-center justify-center gap-2 p-4 mt-6 max-w-md mx-auto bg-gray-100 rounded-lg shadow-md">
              <input
                class="flex-1 px-4 py-2 text-gray-700 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              <button
                class="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                type="submit"
                onClick={searchquery}
              >
                🔍 Search
              </button>
            </div>
          </form>
          {queryloading ? (
            <>
              {" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "10px",
                }}
              >
                <div class="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {data.map((document) => (
              // console.log(document),
              // console.log("chud gaye"),
              <Card document={document} batabe={batabe} query={query}/>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Community;
