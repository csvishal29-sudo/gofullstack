import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";

const Report = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    issueType: "",
    comment: "",
    city: "",
    status: "Pending",
    reportDate: new Date().toISOString().split("T")[0],
    photo: null, // new field
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 📍 Fetch user city name via geolocation + reverse geocoding
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
            );
            const json = await res.json();
            const city =
              json.address?.city ||
              json.address?.town ||
              json.address?.village ||
              json.address?.county ||
              json.display_name ||
              "";
            setFormData((prev) => ({ ...prev, city }));
          } catch (err) {
            console.error("Reverse geocode error:", err);
            setFormData((prev) => ({ ...prev, city: "" }));
          }
        },
        (err) => console.error("Location error:", err)
      );
    }
  }, []);

  // 📸 Load captured photo from localStorage
  useEffect(() => {
    const savedPhoto = localStorage.getItem("capturedPhoto");
    if (savedPhoto) {
      setPreviewUrl(savedPhoto);
      setFormData((prev) => ({ ...prev, photo: savedPhoto }));
      localStorage.removeItem("capturedPhoto");
    }
  }, []);

  // 🖊️ Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        setFormData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🚀 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const payload = {
        issueType: formData.issueType,
        comment: formData.comment,
        city: formData.city,
        status: formData.status,
        reportDate: formData.reportDate,
        photo: formData.photo, // include photo (base64 string)
      };

  await axios.post("http://localhost:3030/api/reports", payload, { withCredentials: true });

      setSuccessMsg("Report submitted successfully!");
      setFormData({
        issueType: "",
        comment: "",
        city: formData.city,
        status: "Pending",
        reportDate: new Date().toISOString().split("T")[0],
        photo: null,
      });
      setPreviewUrl(null);

      setTimeout(() => {
        navigate("/status");
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to submit report. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center">
          <IoIosArrowRoundBack
            size={40}
            className="text-[#3da81dff] cursor-pointer"
            onClick={() => navigate("/")}
          />
          <h2 className="ml-10 text-2xl font-bold text-green-600">
            Smart City Issue Report
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Camera Icon */}
          <div className="flex justify-start">
            <FaCamera
              size={40}
              className="text-green-400 cursor-pointer hover:text-green-600 transition"
              onClick={() => navigate("/capture")}
            />
          </div>

          {/* Photo Preview */}
          {previewUrl && (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Captured"
                className="rounded-xl border shadow-md"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  setFormData((prev) => ({ ...prev, photo: null }));
                }}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs"
              >
                Remove
              </button>
            </div>
          )}

          {/* Manual file upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Or Upload Photo
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-gray-700"
            />
          </div>
          

          <div className="text-sm text-gray-600">
            📍 Location: {formData.city || "Fetching..."}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="reportDate"
              value={formData.reportDate}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <select
            name="issueType"
            value={formData.issueType}
            onChange={handleChange}
            className="p-3 border rounded-xl focus:outline-green-500"
            required
          >
            <option value="">Select Issue Type</option>
            <option value="Garbage">Garbage</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Street Light">Street Light</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            name="comment"
            placeholder="Add your comment..."
            value={formData.comment}
            onChange={handleChange}
            rows="3"
            className="p-3 border rounded-xl focus:outline-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition-all"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>

        {successMsg && (
          <div className="text-green-600 text-center font-semibold">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="text-red-500 text-center font-semibold">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
