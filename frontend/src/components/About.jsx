import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section
      id="about"
      className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-6"
    >
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-green-700">
          About Our Smart City
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
          Welcome to <span className="font-semibold text-green-600">GoCity</span> — 
          a next-generation Smart City Management Platform designed to make 
          urban living more efficient, sustainable, and connected.  
          Our system integrates advanced technologies like IoT, AI, and 
          data analytics to improve transportation, energy use, and 
          citizen engagement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-2">
              Smart Infrastructure
            </h3>
            <p className="text-gray-600">
              Our platform manages utilities, waste, and transportation systems 
              through intelligent monitoring and automation.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-2">
              Sustainable Development
            </h3>
            <p className="text-gray-600">
              We aim to reduce carbon footprints with smart energy grids, 
              eco-friendly transport, and renewable resource planning.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-2">
              Citizen Engagement
            </h3>
            <p className="text-gray-600">
              Empowering citizens through real-time information, 
              smart governance, and participatory urban planning tools.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
