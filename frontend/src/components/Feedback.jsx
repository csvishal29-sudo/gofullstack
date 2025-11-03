
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      alert("Please give a rating and enter a comment before submitting!");
      return;
    }

    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setRating(0);
      setComment("");
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section
      id="feedback"
      className="min-h-screen flex items-center justify-center bg-gray-50 py-16 px-6"
    >
      <motion.div
        className="max-w-lg w-full bg-white shadow-lg rounded-2xl p-8 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          We Value Your Feedback
        </h2>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={36}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className={`cursor-pointer transition-transform transform hover:scale-110 ${
                    star <= (hover || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Comment Box */}
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Share your thoughts about the Smart City platform..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              whileTap={{ scale: 0.95 }}
            >
              Submit Feedback
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-green-600 font-semibold text-lg mt-4"
          >
            🎉 Thank you for your feedback!
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Feedback;
