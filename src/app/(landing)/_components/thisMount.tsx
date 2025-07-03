/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { Tour } from "@prisma/client";
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Star, Clock, TrendingUp } from 'lucide-react';

export function MonthlyFeaturedTours({
  tours,
  title = "Voyages du Mois",
  subtitle = "Nos destinations coup de cœur à ne pas manquer ce mois-ci"
}: {
  tours: Tour[];
  title?: string;
  subtitle?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // Initialisation
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtrer les voyages actifs
  const activeTours = tours.filter(tour => tour.active);
  
  // Navigation
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === activeTours.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? activeTours.length - 1 : prevIndex - 1
    );
  };

  // Sélection directe
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Formatage du prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  // Gestion des animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Si aucun voyage n'est disponible
  if (activeTours.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl">
        <p className="text-gray-500">Aucun voyage du mois disponible pour le moment</p>
      </div>
    );
  }

  // Tour actuel
  const currentTour = activeTours[currentIndex];

  return (
    <div className="relative py-16 lg:px-16 overflow-hidden">
      {/* Fond décoratif avec motif */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-70">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'url("/pattern-dots.png")', 
          backgroundSize: '30px 30px',
          opacity: 0.2
        }} />
      </div>

      {/* Conteneur principal */}
      <div className="relative container mx-auto px-4 z-10">
        {/* En-tête de section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-3 px-4 py-1 bg-gradient-to-r from-[#8EBD22] to-[#b0f70a] rounded-full text-white text-sm font-medium"
          >
            <TrendingUp className="inline-block w-4 h-4 mr-1 -mt-0.5" />
            Tendances
          </motion.div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#719912] via-[#b0f70a] to-[#719912] inline-block text-transparent bg-clip-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {title}
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Carrousel principal */}
        <div className="relative">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Image principale (3 colonnes sur desktop) */}
            <motion.div 
              className="lg:col-span-3 relative rounded-2xl overflow-hidden group h-[350px] md:h-[500px] bg-cover bg-center"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              
            >
              {/* Image avec effet de zoom */}
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out transform group-hover:scale-110">
                <img 
                  src={currentTour.imageUrl || "/placeholder-destination.jpg"} 
                  alt={currentTour.title || "Destination du mois"}
                  style={{ objectFit: 'cover' }}
                  className='bg-cover w-full h-full'
                />
              </div>
              
              
              {/* Overlay dégradé */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent" />
              
              {/* Badge promo conditionnel */}
              {currentTour.priceOriginal !== currentTour.priceDiscounted && (
                <motion.div 
                  className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  PROMO
                </motion.div>
              )}
              
              {/* Contenu sur l'image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-white mr-2" />
                    <span className="text-white text-sm">{currentTour.dateCard}</span>
                  </div>
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">{currentTour.title}</h3>
                  
                  {/* Badges d'information */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      {currentTour.durationDays}J / {currentTour.durationNights}N
                    </span>
                    {currentTour.showHebergement && (
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                        {currentTour.accommodationType}
                      </span>
                    )}
                    {currentTour.showDifficulty && (
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                        Niveau {currentTour.difficultyLevel}/5
                      </span>
                    )}
                  </div>
                  
                  {/* Prix et bouton */}
                  <div className="flex items-center justify-between">
                    <div>
                      {currentTour.priceOriginal !== currentTour.priceDiscounted && (
                        <span className="text-white/70 line-through text-sm mr-2">
                          {formatPrice(currentTour.priceOriginal || 0)} DH
                        </span>
                      )}
                      <span className="text-white text-2xl font-bold">
                        {formatPrice(currentTour.priceDiscounted || 0)} DH
                      </span>
                    </div>
                    <motion.button
                      onClick={() => window.location.href = `/voyage/${currentTour.id}`}
                      className="bg-white text-[#719912] px-6 py-2 rounded-full font-medium hover:bg-purple-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Découvrir
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Informations complémentaires (2 colonnes sur desktop) */}
            <motion.div 
              className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 md:p-8 flex lg:flex-col flex-col-reverse"
            >
              {/* Badge "Voyage du mois" */}
             <div>
               <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-[#719912] rounded-full text-sm font-medium mb-4">
                ✨ Voyage du mois
              </div>
              
              <h4 className="text-xl font-bold mb-4">Pourquoi nous l&apos;adorons</h4>
              
              {/* Liste des avantages */}
              <ul className="space-y-4 mb-6">
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-purple-100 rounded-full p-2 mr-3 mt-0.5">
                    <Star className="w-4 h-4 text-[#8EBD22]" />
                  </div>
                  <div>
                    <span className="font-medium block">Expérience unique</span>
                    <span className="text-gray-600 text-sm">Découvrez des lieux exceptionnels et authentiques</span>
                  </div>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-purple-100 rounded-full p-2 mr-3 mt-0.5">
                    <Clock className="w-4 h-4 text-[#8EBD22]" />
                  </div>
                  <div>
                    <span className="font-medium block">Période idéale</span>
                    <span className="text-gray-600 text-sm">Le meilleur moment pour visiter cette destination</span>
                  </div>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-purple-100 rounded-full p-2 mr-3 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#8EBD22]" />
                  </div>
                  <div>
                    <span className="font-medium block">Lieux incontournables</span>
                    <span className="text-gray-600 text-sm">Un itinéraire soigneusement élaboré</span>
                  </div>
                </motion.li>
              </ul>
             </div>
              
              {/* Miniatures des autres voyages */}
              {activeTours.length > 1 && (
                <div>
                  <h4 className="text-lg font-medium mb-3">Autres destinations du mois</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {activeTours.map((tour, index) => (
                      <motion.div 
                        key={tour.id}
                        className={`relative rounded-lg overflow-hidden cursor-pointer h-20 ${index === currentIndex ? 'ring-2 ring-[#8EBD22]' : ''}`}
                        onClick={() => goToSlide(index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <img 
                          src={tour.imageUrl || "/placeholder-destination.jpg"} 
                          alt={tour.title || "Destination"}
                          style={{ objectFit: 'cover' }}
                          className='w-full h-full'
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        {index === currentIndex && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white rounded-full p-1">
                              <div className="bg-[#8EBD22] rounded-full w-2 h-2"></div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
          
          {/* Contrôles de navigation */}
          {activeTours.length > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <motion.button
                onClick={prevSlide}
                className="bg-white text-[#719912] p-3 rounded-full shadow-md hover:bg-purple-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <div className="flex items-center gap-1.5">
                {activeTours.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full ${index === currentIndex ? 'bg-[#8EBD22]' : 'bg-purple-200'}`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  />
                ))}
              </div>
              <motion.button
                onClick={nextSlide}
                className="bg-white text-[#719912] p-3 rounded-full shadow-md hover:bg-purple-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MonthlyFeaturedTours;
