/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Star, 
  Check, 
  X, 
  Phone, 
  Mail, 
  MessageCircle,
  Heart,
  Share2,
  Camera,
  Bed,
  Car,
  Utensils,
  Shield,
  Award,
  ChevronDown,
  ChevronUp,
  Search,
  Filter
} from 'lucide-react';

// Données d'exemple pour la démonstration
const sampleTravelData = {
  id: "marrakech-desert-3j",
  title: "Marrakech & Désert du Sahara",
  subtitle: "Aventure de 3 jours dans le désert marocain",
  location: "Marrakech - Merzouga",
  price: 2500,
  originalPrice: 3200,
  currency: "MAD",
  duration: "3 jours / 2 nuits",
  groupSize: "2-8 personnes",
  difficulty: "Facile",
  rating: 4.8,
  reviewCount: 127,
  images: [
    "https://images.pexels.com/photos/32825413/pexels-photo-32825413.jpeg",
    "https://images.pexels.com/photos/19134388/pexels-photo-19134388.jpeg",
    "https://images.pexels.com/photos/22043841/pexels-photo-22043841.jpeg",
    "https://images.pexels.com/photos/19078368/pexels-photo-19078368.jpeg"
  ],
  description: "Découvrez la magie du Maroc avec cette aventure inoubliable qui vous mènera de la ville impériale de Marrakech aux dunes dorées du Sahara. Une expérience authentique qui combine culture, aventure et détente dans un cadre exceptionnel.",
  highlights: [
    "Nuit sous les étoiles dans le désert",
    "Balade à dos de chameau au coucher du soleil",
    "Visite des souks de Marrakech",
    "Rencontre avec les nomades berbères",
    "Spectacle traditionnel autour du feu"
  ],
  itinerary: [
    {
      day: 1,
      title: "Arrivée à Marrakech",
      description: "Accueil à l'aéroport et transfert vers votre riad. Visite guidée de la médina et des souks traditionnels. Découverte de la place Jemaa el-Fna en soirée.",
      activities: ["Visite de la Koutoubia", "Exploration des souks", "Dîner traditionnel"],
      accommodation: "Riad traditionnel",
      meals: ["Dîner"],
      image: "https://images.pexels.com/photos/19078368/pexels-photo-19078368.jpeg"
    },
    {
      day: 2,
      title: "Route vers le Désert",
      description: "Départ matinal vers Merzouga en traversant l'Atlas et les oasis. Arrivée au camp de base et balade à dos de chameau pour admirer le coucher de soleil.",
      activities: ["Traversée de l'Atlas", "Visite d'oasis", "Balade à dos de chameau", "Coucher de soleil"],
      accommodation: "Camp dans le désert",
      meals: ["Petit-déjeuner", "Déjeuner", "Dîner"],
      image: "https://images.pexels.com/photos/19078368/pexels-photo-19078368.jpeg"
    },
    {
      day: 3,
      title: "Lever de soleil et Retour",
      description: "Réveil avant l'aube pour admirer le lever de soleil sur les dunes. Retour vers Marrakech avec arrêts dans des villages berbères authentiques.",
      activities: ["Lever de soleil", "Visite de villages berbères", "Shopping d'artisanat"],
      accommodation: "Retour en ville",
      meals: ["Petit-déjeuner", "Déjeuner"],
      image: "https://images.pexels.com/photos/19078368/pexels-photo-19078368.jpeg"
    }
  ],
  included: [
    "Transport en véhicule climatisé",
    "Guide francophone expérimenté",
    "Hébergement en riad et camp désert",
    "Tous les repas mentionnés",
    "Balade à dos de chameau",
    "Spectacles traditionnels",
    "Assurance voyage"
  ],
  excluded: [
    "Vols internationaux",
    "Repas non mentionnés",
    "Boissons alcoolisées",
    "Pourboires",
    "Dépenses personnelles",
    "Activités optionnelles"
  ],
  accommodations: [
    {
      name: "Riad Atlas Marrakech",
      type: "Riad traditionnel",
      rating: 4.5,
      description: "Riad authentique au cœur de la médina avec patio traditionnel et terrasse panoramique.",
      amenities: ["WiFi gratuit", "Climatisation", "Terrasse", "Restaurant"],
      image: "https://images.pexels.com/photos/22043841/pexels-photo-22043841.jpeg"
    },
    {
      name: "Camp Luxury Desert",
      type: "Camp dans le désert",
      rating: 4.8,
      description: "Camp de luxe avec tentes berbères équipées, sanitaires privés et restaurant sous les étoiles.",
      amenities: ["Tentes équipées", "Sanitaires privés", "Restaurant", "Spectacles"],
      image: "https://images.pexels.com/photos/19078368/pexels-photo-19078368.jpeg"
    }
  ],
  reviews: [
    {
      id: 1,
      name: "Sarah Martin",
      rating: 5,
      date: "2024-01-15",
      comment: "Expérience absolument magique ! Le guide était fantastique et les paysages à couper le souffle. Je recommande vivement !",
      avatar: "https://images.pexels.com/photos/19134388/pexels-photo-19134388.jpeg",
      verified: true
    },
    {
      id: 2,
      name: "Ahmed Benali",
      rating: 4,
      date: "2024-01-10",
      comment: "Très beau voyage, bien organisé. Seul bémol : le trajet un peu long, mais ça vaut le coup !",
      avatar: "https://images.pexels.com/photos/32825413/pexels-photo-32825413.jpeg",
      verified: true
    },
    {
      id: 3,
      name: "Marie Dubois",
      rating: 5,
      date: "2024-01-05",
      comment: "Une aventure inoubliable ! Le coucher de soleil dans le désert restera gravé dans ma mémoire.",
      avatar: "https://images.pexels.com/photos/19134388/pexels-photo-19134388.jpeg",
      verified: true
    }
  ],
  faq: [
    {
      id: 1,
      question: "Quelle est la meilleure période pour ce voyage ?",
      answer: "La meilleure période est d'octobre à avril, quand les températures sont plus clémentes. Évitez l'été où il peut faire très chaud dans le désert."
    },
    {
      id: 2,
      question: "Le voyage est-il adapté aux enfants ?",
      answer: "Oui, ce voyage convient aux familles avec enfants à partir de 8 ans. Les activités sont adaptées et sécurisées."
    },
    {
      id: 3,
      question: "Que faut-il emporter ?",
      answer: "Vêtements légers pour la journée, vêtements chauds pour la nuit, chaussures de marche, crème solaire, chapeau et appareil photo."
    },
    {
      id: 4,
      question: "Les repas sont-ils adaptés aux régimes spéciaux ?",
      answer: "Oui, nous pouvons adapter les repas aux régimes végétariens, végétaliens ou autres restrictions alimentaires. Merci de nous prévenir à la réservation."
    }
  ]
};

// Composant principal de la page de détails
const TravelDetailPage = ({ travelData = sampleTravelData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeItineraryDay, setActiveItineraryDay] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState<any>();
  const [selectedDate, setSelectedDate] = useState('');
  const [participants, setParticipants] = useState(2);
  const [activeSection, setActiveSection] = useState('overview');

  // Refs pour la navigation
  const overviewRef = useRef(null);
  const itineraryRef = useRef(null);
  const inclusionsRef = useRef(null);
  const accommodationRef = useRef(null);
  const reviewsRef = useRef(null);
  const faqRef = useRef(null);

  // Animation controls
  const controls = useAnimation();
  const isInView = useInView(overviewRef, { amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Navigation entre les images
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === travelData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? travelData.images.length - 1 : prev - 1
    );
  };

  // Scroll vers une section
  const scrollToSection = (sectionRef:any, sectionName:any) => {
    setActiveSection(sectionName);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section avec Galerie d'Images */}
      <motion.section 
        className="relative h-[70vh] overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="relative w-full h-full">
          <motion.img
            key={currentImageIndex}
            src={travelData.images[currentImageIndex]}
            alt={travelData.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Navigation des images */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicateurs d'images */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {travelData.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Informations overlay */}
          <motion.div 
            className="absolute bottom-8 left-8 text-white"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{travelData.location}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{travelData.title}</h1>
            <p className="text-xl opacity-90">{travelData.subtitle}</p>
          </motion.div>

          {/* Badge de prix */}
          <motion.div 
            className="absolute top-8 right-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full shadow-lg"
            variants={itemVariants}
          >
            <div className="text-center">
              {travelData.originalPrice && (
                <div className="text-sm line-through opacity-75">
                  {travelData.originalPrice} {travelData.currency}
                </div>
              )}
              <div className="text-2xl font-bold">
                {travelData.price} {travelData.currency}
              </div>
            </div>
          </motion.div>

          {/* Actions rapides */}
          <motion.div 
            className="absolute top-8 left-8 flex space-x-3"
            variants={itemVariants}
          >
            <button className="bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300">
              <Heart className="w-5 h-5" />
            </button>
            <button className="bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300">
              <Camera className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Navigation Sticky */}
      <motion.nav 
        className="sticky top-0 z-40 bg-white shadow-md border-b"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {[
              { name: 'Vue d\'ensemble', ref: overviewRef, key: 'overview' },
              { name: 'Itinéraire', ref: itineraryRef, key: 'itinerary' },
              { name: 'Inclusions', ref: inclusionsRef, key: 'inclusions' },
              { name: 'Hébergement', ref: accommodationRef, key: 'accommodation' },
              { name: 'Avis', ref: reviewsRef, key: 'reviews' },
              { name: 'FAQ', ref: faqRef, key: 'faq' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.ref, item.key)}
                className={`whitespace-nowrap px-4 py-2 rounded-full transition-all duration-300 ${
                  activeSection === item.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne Principale */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Vue d'ensemble */}
            <motion.section 
              ref={overviewRef}
              className="bg-white rounded-2xl shadow-lg p-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{travelData.title}</h2>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-semibold">{travelData.rating}</span>
                        <span>({travelData.reviewCount} avis)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-5 h-5" />
                        <span>{travelData.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations rapides */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{travelData.duration}</div>
                    <div className="text-sm text-gray-600">Durée</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{travelData.groupSize}</div>
                    <div className="text-sm text-gray-600">Groupe</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{travelData.difficulty}</div>
                    <div className="text-sm text-gray-600">Difficulté</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{travelData.description}</p>
                </div>

                {/* Points forts */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Points forts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {travelData.highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        variants={itemVariants}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.section>

            {/* Itinéraire */}
            <motion.section 
              ref={itineraryRef}
              className="bg-white rounded-2xl shadow-lg p-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.h2 
                className="text-3xl font-bold text-gray-900 mb-8"
                variants={itemVariants}
              >
                Itinéraire détaillé
              </motion.h2>
              
              <div className="space-y-6">
                {travelData.itinerary.map((day, index) => (
                  <motion.div
                    key={day.day}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => setActiveItineraryDay(activeItineraryDay === index ? -1 : index)}
                      className="w-full p-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            Jour {day.day}: {day.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{day.description}</p>
                        </div>
                        {activeItineraryDay === index ? (
                          <ChevronUp className="w-6 h-6 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </button>
                    
                    {activeItineraryDay === index && (
                      <motion.div
                        className="p-6 bg-white"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <img
                              src={day.image}
                              alt={day.title}
                              className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Activités</h4>
                                <ul className="space-y-1">
                                  {day.activities.map((activity, actIndex) => (
                                    <li key={actIndex} className="flex items-center space-x-2">
                                      <Check className="w-4 h-4 text-green-600" />
                                      <span className="text-gray-700">{activity}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Bed className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold">Hébergement</span>
                              </div>
                              <p className="text-gray-700">{day.accommodation}</p>
                            </div>
                            
                            <div className="bg-green-50 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Utensils className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">Repas inclus</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {day.meals.map((meal, mealIndex) => (
                                  <span
                                    key={mealIndex}
                                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                  >
                                    {meal}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Inclusions/Exclusions */}
            <motion.section 
              ref={inclusionsRef}
              className="bg-white rounded-2xl shadow-lg p-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.h2 
                className="text-3xl font-bold text-gray-900 mb-8"
                variants={itemVariants}
              >
                Ce qui est inclus / non inclus
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inclusions */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
                    <Check className="w-6 h-6 mr-2" />
                    Inclus dans le prix
                  </h3>
                  <div className="space-y-3">
                    {travelData.included.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Exclusions */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
                    <X className="w-6 h-6 mr-2" />
                    Non inclus
                  </h3>
                  <div className="space-y-3">
                    {travelData.excluded.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* Hébergements */}
            <motion.section 
              ref={accommodationRef}
              className="bg-white rounded-2xl shadow-lg p-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.h2 
                className="text-3xl font-bold text-gray-900 mb-8"
                variants={itemVariants}
              >
                Hébergements
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {travelData.accommodations.map((accommodation, index) => (
                  <motion.div
                    key={index}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <img
                      src={accommodation.image}
                      alt={accommodation.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{accommodation.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{accommodation.rating}</span>
                        </div>
                      </div>
                      <p className="text-blue-600 font-medium mb-3">{accommodation.type}</p>
                      <p className="text-gray-700 mb-4">{accommodation.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {accommodation.amenities.map((amenity, amenityIndex) => (
                          <span
                            key={amenityIndex}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Avis clients */}
            <motion.section 
              ref={reviewsRef}
              className="bg-white rounded-2xl shadow-lg p-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div 
                className="flex items-center justify-between mb-8"
                variants={itemVariants}
              >
                <h2 className="text-3xl font-bold text-gray-900">Avis clients</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(travelData.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-semibold">{travelData.rating}</span>
                  <span className="text-gray-600">({travelData.reviewCount} avis)</span>
                </div>
              </motion.div>
              
              <div className="space-y-6">
                {travelData.reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    className="border border-gray-200 rounded-xl p-6"
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.name}</h4>
                            <p className="text-sm text-gray-600">{review.date}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        {review.verified && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600">Avis vérifié</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* FAQ */}
            <motion.section 
              ref={faqRef}
              className="bg-white rounded-2xl shadow-lg p-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.h2 
                className="text-3xl font-bold text-gray-900 mb-8"
                variants={itemVariants}
              >
                Questions fréquentes
              </motion.h2>
              
              <div className="space-y-4">
                {travelData.faq.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => setActiveFaqIndex(activeFaqIndex === index ? null : index)}
                      className="w-full p-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                        {activeFaqIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    
                    {activeFaqIndex === index && (
                      <motion.div
                        className="p-6 bg-white"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-gray-700">{item.answer}</p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar de Réservation */}
          <div className="lg:col-span-1">
            <motion.div 
              className="sticky top-24 bg-white rounded-2xl shadow-lg p-6"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  {travelData.price} {travelData.currency}
                </div>
                {travelData.originalPrice && (
                  <div className="text-lg text-gray-500 line-through">
                    {travelData.originalPrice} {travelData.currency}
                  </div>
                )}
                <div className="text-sm text-gray-600">par personne</div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de départ
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de participants
                  </label>
                  <select
                    value={participants}
                    onChange={(e) => setParticipants(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'personne' : 'personnes'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>{travelData.price * participants} {travelData.currency}</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 mb-4">
                Réserver maintenant
              </button>

              <div className="text-center text-sm text-gray-600 mb-6">
                Réservation gratuite • Annulation flexible
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-300">
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </button>
                
                <button className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                  <Phone className="w-5 h-5" />
                  <span>Appeler</span>
                </button>
                
                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Besoin d&apos;aide ?</h4>
                <p className="text-sm text-blue-700">
                  Notre équipe est disponible 24h/7j pour répondre à toutes vos questions.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelDetailPage;
export { sampleTravelData };

