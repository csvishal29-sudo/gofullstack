import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";

export default function Report() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    issueType: "",
    comment: "",
    city: "",
    status: "Pending",
    reportDate: new Date().toISOString().split("T")[0],
    // photo will be either: null | File | dataURL string
    photo: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // reverse geocode to get city
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

  // load captured photo (base64) from localStorage if present
  useEffect(() => {
    const savedPhoto = localStorage.getItem("capturedPhoto");
    if (savedPhoto) {
      setPreviewUrl(savedPhoto);
      // store as dataURL string; submit will convert to Blob/File
      setFormData((prev) => ({ ...prev, photo: savedPhoto }));
      localStorage.removeItem("capturedPhoto");
    }
  }, []);

  // helper: convert dataURL (base64) to Blob
  function dataURLToBlob(dataURL) {
    const parts = dataURL.split(',');
    const meta = parts[0].match(/:(.*?);/);
    const mime = meta ? meta[1] : 'image/jpeg';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

  // handle input changes and file selection
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        // store the File so we can append directly to FormData
        setFormData((prev) => ({ ...prev, photo: file }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // submit using multipart/form-data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const form = new FormData();
      form.append("issueType", formData.issueType);
      form.append("comment", formData.comment || "");
      form.append("city", formData.city || "");
      form.append("status", formData.status || "Pending");
      form.append("reportDate", formData.reportDate);

      if (formData.photo) {
        // If photo is a base64 dataURL string (from capture), convert to Blob
        if (typeof formData.photo === "string" && formData.photo.startsWith("data:")) {
          const blob = dataURLToBlob(formData.photo);
          const file = new File([blob], `photo-${Date.now()}.jpg`, { type: blob.type });
          form.append("photo", file);
        } else if (formData.photo instanceof File) {
          // File selected via input
          form.append("photo", formData.photo);
        }
      }

      // DEBUG: list form keys (values of files will be File objects)
      for (let pair of form.entries()) {
        // avoid printing binary content, print key + value type
        const val = pair[1];
        if (val instanceof File) console.log("form entry:", pair[0], "=> File(" + val.name + ")");
        else console.log("form entry:", pair[0], "=>", val);
      }

      const res = await axios.post(
        "https://gocity-backend.onrender.com/api/reports",
        form,
        {
          withCredentials: true,
          // DO NOT set Content-Type header — browser will set boundary automatically
        }
      );

      console.log("server response:", res.data);
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

      setTimeout(() => navigate("/status"), 1200);
    } catch (err) {
      console.error("submit error:", err);
      const backendMsg = err.response?.data || err.response?.statusText || err.message;
      console.error("backend message:", backendMsg);
      setErrorMsg(typeof backendMsg === "string" ? backendMsg : JSON.stringify(backendMsg));
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
          <h2 className="ml-10 text-2xl font-bold text-green-600">Smart City Issue Report</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-start">
            <FaCamera
              size={40}
              className="text-green-400 cursor-pointer hover:text-green-600 transition"
              onClick={() => navigate("/capture")}
            />
          </div>

          {previewUrl && (
            <div className="relative">
              <img src={previewUrl} alt="Captured" className="rounded-xl border shadow-md" />
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Or Upload Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-gray-700"
            />
          </div>

          <div className="text-sm text-gray-600">📍 Location: {formData.city || "Fetching..."}</div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
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

        {successMsg && <div className="text-green-600 text-center font-semibold">{successMsg}</div>}
        {errorMsg && <div className="text-red-500 text-center font-semibold">{errorMsg}</div>}
      </div>
    </div>
  );
}
