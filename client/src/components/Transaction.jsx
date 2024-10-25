import React, { useEffect, useState } from "react";
import '../App.css';
import axios from "../api/axios";

const Transaction = ({ selectedMonthCode }) => {
  const [data, setData] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); 
      try {
        const response = await axios.get(`/transactions?month=${selectedMonthCode}`);
        setData(response.data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.response ? error.response.data.message : 'Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonthCode]);

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-1">
      
      <div className="flex justify-around items-center w-full mb-8">
        <input
          className="px-4 py-2  bg-yellow-400 placeholder-black-500 placeholder-opacity-50 border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          type="search"
          placeholder="Search Transaction"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search Transaction"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="table-auto w-full mb-4 ">
        <thead>
          <tr className="bg-[#f8df8c]">
            <th className="px-4 py-2 border-2 border-black">ID</th>
            <th className="px-4 py-2 border-2 border-black">Title</th>
            <th className="px-4 py-2 border-2 border-black">Description</th>
            <th className="px-4 py-2 border-2 border-black">Price</th>
            <th className="px-4 py-2 border-2 border-black">Category</th>
            <th className="px-4 py-2 border-2 border-black">Sold</th>
            <th className="px-4 py-2 border-2 border-black">Image</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <tr key={item.id} className="bg-[#f8df8c]">
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.category}</td>
                <td>{item.sold ? "Yes" : "No"}</td>
                <td>
                  <img src={item.image} alt={item.title} width="50" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-red-500">No transactions found for {selectedMonthCode}</td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              aria-label={`Page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Transaction;
