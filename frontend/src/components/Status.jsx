import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Status = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:3030/api/reports");
        const reports = await response.json();
        setData(reports.map(report => ({
          Id: report._id,
          "Issue Type": report.issueType,
          "Report Date": new Date(report.reportDate).toLocaleDateString(),
          Location: report.city || "Unknown",
          Status: report.status
        })));
      } catch (error) {
        console.error("Error loading reports:", error);
      }
    };
    
    fetchReports();
  }, []);

  // Filter logic
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item["Issue Type"].toLowerCase().includes(search.toLowerCase()) ||
      item.Location.toLowerCase().includes(search.toLowerCase()) ||
      item["Report Date"].toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || item.Status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Export data to CSV
  const exportToCSV = () => {
    const headers = ["SNo", "Issue Type", "Report Date", "Location", "Status"];
    // Use filteredData so export matches what the user currently sees
    const rows = filteredData.map((item, index) => [
      index + 1,
      item["Issue Type"],
      item["Report Date"],
      item.Location,
      item.Status,
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "status_data.csv";
    link.click();
  };

  const getStatusColor = (status) => {
    if (status === "Completed") return "bg-green-500 text-white";
    if (status === "Pending") return "bg-yellow-500 text-white";
    return "bg-gray-400 text-white";
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6ffe6] via-[#f6fff6] to-[#e6ffe6] p-6">
      <div className="w-full max-w-5xl bg-white/30 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-white/40">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <IoIosArrowRoundBack
              size={40}
              className="text-[#4dff1f] drop-shadow-lg cursor-pointer hover:text-[#3da81dff] transition-colors duration-200"
              onClick={() => navigate("/")}
            />
            <h2 className="text-3xl font-extrabold text-[#3da81dff] drop-shadow-md">Status of Uploaded Reports</h2>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-white/40 bg-white/60 backdrop-blur px-4 py-2 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-[#4dff1f] text-gray-900 placeholder-gray-500 shadow"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-white/40 bg-white/60 backdrop-blur px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4dff1f] text-gray-900 shadow"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              onClick={exportToCSV}
              className="bg-[#4dff1f] hover:bg-[#3be810] text-gray-900 font-semibold px-5 py-2 rounded-lg shadow transition-colors duration-200 border border-white/40"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full text-base border border-white/30 bg-white/60 backdrop-blur-md rounded-xl">
            <thead className="bg-white/80">
              <tr>
                <th className="py-3 px-4 text-left border-b border-white/30 text-[#3da81dff] font-bold">SNo</th>
                <th className="py-3 px-4 text-left border-b border-white/30 text-[#3da81dff] font-bold">Issue Type</th>
                <th className="py-3 px-4 text-left border-b border-white/30 text-[#3da81dff] font-bold">Report Date</th>
                <th className="py-3 px-4 text-left border-b border-white/30 text-[#3da81dff] font-bold">Location</th>
                <th className="py-3 px-4 text-left border-b border-white/30 text-[#3da81dff] font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, idx) => (
                  <tr key={item.Id} className="hover:bg-[#eaffea] transition-colors">
                    <td className="py-3 px-4 border-b border-white/30 font-semibold">{idx + 1}</td>
                    <td className="py-3 px-4 border-b border-white/30">{item["Issue Type"]}</td>
                    <td className="py-3 px-4 border-b border-white/30">{item["Report Date"]}</td>
                    <td className="py-3 px-4 border-b border-white/30">{item.Location}</td>
                    <td className="py-3 px-4 border-b border-white/30">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${getStatusColor(
                          item.Status
                        )}`}
                      >
                        {item.Status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-gray-500"
                  >
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    

    
  );
};

export default Status;
