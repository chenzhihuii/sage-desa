import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { FaImages, FaTimes } from 'react-icons/fa';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { id: '1', urls: { small: '/assets/h1.jpeg', regular: '/assets/h1.jpeg' }, alt_description: 'Image 1 description' },
    { id: '2', urls: { small: '/assets/h2.jpeg', regular: '/assets/h2.jpeg' }, alt_description: 'Image 2 description' },
    { id: '3', urls: { small: '/assets/h6.jpeg', regular: '/assets/h6.jpeg' }, alt_description: 'Image 3 description' },
    { id: '4', urls: { small: '/assets/h3.jpeg', regular: '/assets/h3.jpeg' }, alt_description: 'Image 4 description' },
    { id: '5', urls: { small: '/assets/v1.jpg', regular: '/assets/v1.jpg' }, alt_description: 'Image 5 description' },
    { id: '6', urls: { small: '/assets/v2.jpg', regular: '/assets/v2.jpg' }, alt_description: 'Image 6 description' },
    { id: '7', urls: { small: '/assets/v3.png', regular: '/assets/v3.png' }, alt_description: 'Image 7 description' },
    { id: '8', urls: { small: '/assets/v4.jpeg', regular: '/assets/v4.jpeg' }, alt_description: 'Image 8 description' },
    { id: '9', urls: { small: '/assets/h4.jpeg', regular: '/assets/h4.jpeg' }, alt_description: 'Image 9 description' },
    { id: '10', urls: { small: '/assets/h7.jpeg', regular: '/assets/h7.jpeg' }, alt_description: 'Image 10 description' },
    { id: '11', urls: { small: '/assets/h10.jpeg', regular: '/assets/h10.jpg' }, alt_description: 'Image 11 description' },
    { id: '12', urls: { small: '/assets/h9.jpeg', regular: '/assets/h9.jpeg' }, alt_description: 'Image 12 description' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen pt-20 bg-gradient-to-br from-[#c5e3de] via-[#e0f0ed] to-[#c5e3de] dark:from-black dark:via-gray-900 dark:to-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 pb-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Dokumentsi Lapangan
          </h1>
          <p className="text-gray-500 dark:text-white/50 text-sm md:text-base">
            Dokumentasi kegiatan survei serta kondisi lahan pertanian di lokasi penelitian
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`relative group cursor-pointer rounded-xl overflow-hidden
                ${image.urls.small.includes('/v') ? 'row-span-2' : 'row-span-1'}`}
              onClick={() => setSelectedImage(image.urls.regular)}
            >
              <img src={image.urls.small} alt={image.alt_description}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <FaImages className="text-white text-2xl" />
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
                <button className="absolute -top-12 right-0 text-white/60 hover:text-white text-4xl" onClick={() => setSelectedImage(null)}>
                  <FaTimes />
                </button>
                <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={selectedImage} alt="Selected image"
                  className="w-full h-auto rounded-xl shadow-2xl" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Gallery;
