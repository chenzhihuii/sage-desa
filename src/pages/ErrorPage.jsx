import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaHome } from 'react-icons/fa';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF0DE] via-[#F0F5E8] to-[#EAF0DE] dark:from-green-900 dark:via-gray-900 dark:to-emerald-950 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjEyMTIxIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMyOTI5MjkiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-10 dark:opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, 0], y: [0, -5, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <FaLeaf className="text-8xl text-green-500 dark:text-green-400" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-lg mx-auto">
            <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 dark:from-green-300 dark:via-emerald-400 dark:to-green-500 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-green-100">
              Page Not Found
            </h2>
            <p className="text-xl text-gray-600 dark:text-green-100/70 mb-8">
              Looks like this field hasn't been planted yet. Let's head back to familiar ground.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/"
                className="inline-flex items-center gap-3 px-8 py-4
                  bg-gradient-to-r from-green-500 to-emerald-600
                  text-white rounded-full text-lg font-semibold
                  shadow-xl shadow-green-500/20
                  hover:shadow-green-500/30 hover:from-green-400
                  hover:to-emerald-500 transition-all duration-300"
              >
                <FaHome className="text-2xl" />
                Return Home
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-32 -bottom-32 w-96 h-96 bg-green-400/10 dark:bg-green-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-32 -top-32 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl"
      />
    </div>
  );
};

export default ErrorPage;
