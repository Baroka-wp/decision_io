import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Play, RefreshCw, FileText, PhoneCall, User, 
    Check, Star, MessageCircle, Briefcase, 
    Mail, MapPin, Linkedin, Twitter, Instagram 
} from 'lucide-react';
import { api } from '../api';
import UserInfoModal from './modal/UserInfoModal';
import Navbar from './Navbar';
import Service from '../components/services';
import Testimonial from '../components/testimonial';
import Footer from '../components/footer';


const CharlesPresentation = ({ onStartOrientation, onViewExistingDecision }) => {
    const [hasExistingDecision, setHasExistingDecision] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showUserInfoModal, setShowUserInfoModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkExistingDecision = async () => {
            const storedUserName = localStorage.getItem('user_Name');
            if (storedUserName) {
                try {
                    const user = JSON.parse(storedUserName);
                    const response = await api.get(`/history/session/${user.id}`);
                    if (response.data.length > 0) {
                        setHasExistingDecision(true);
                    }
                } catch (error) {
                    console.error('Error checking existing decision:', error);
                }
            }
            setIsLoading(false);
        };

        checkExistingDecision();
    }, []);

    const handleStartNewOrientation = () => {
        const storedUserName = localStorage.getItem('user_Name');
        if (storedUserName) {
            onStartOrientation();
        } else {
            setShowUserInfoModal(true);
        }
    };

    const handleViewExistingDecision = () => {
        onViewExistingDecision();
    };

    const handleTalkToCoach = () => {
        const storedUserName = localStorage.getItem('user_Name');
        if (storedUserName) {
            navigate('/coaches');
        } else {
            setShowUserInfoModal(true);
        }
    };

    const handleUserInfoSubmit = (info) => {
        localStorage.setItem('user_Name', JSON.stringify(info));
        setShowUserInfoModal(false);
        navigate('/coaches');
    };

    if (isLoading) {
        return (
            <div className="loader">
                <div></div><div></div><div></div><div></div>
            </div>
        );
    }


    const servicesData = [
        {
          icon: <Briefcase className="text-[#6A5ACD]" size={48} />,
          title: "Orientation Personnalisée",
          description: "Une analyse approfondie pour découvrir votre voie professionnelle idéale.",
        },
        {
          icon: <FileText className="text-[#6A5ACD]" size={48} />,
          title: "Rapport Détaillé",
          description: "Un document complet sur vos compétences et opportunités de carrière.",
        },
        {
          icon: <MessageCircle className="text-[#6A5ACD]" size={48} />,
          title: "Coaching Individuel",
          description: "Des conseils personnalisés pour affiner votre parcours professionnel.",
        },
    ];

    const testimonialsData = [
        {
          name: "Marie Dupont",
          role: "Étudiante en Marketing",
          quote: "Grâce à Décision, j'ai trouvé ma voie et je me sens enfin en confiance pour mon avenir.",
        },
        {
          name: "Jean Martin",
          role: "Lycéen",
          quote: "Le coaching m'a aidé à comprendre mes véritables passions et compétences.",
        },
        {
          name: "Sophie Leroy",
          role: "Future Ingénieure",
          quote: "Un service incroyablement personnalisé qui m'a guidée vers ma carrière de rêve.",
        },
    ];

    return (
        <div className="bg-gradient-to-br from-[#F5F5FA] to-[#FFFFFF]">
            {/* Navbar */}
            <Navbar />
            {/* Hero Section */}
            <header id="home" className="pt-24 pb-16 px-4 max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
                <div className="max-w-3xl space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2C3E50] leading-tight">
                        Trouve ta voie professionnelle
                    </h1>
                    <p className="text-lg text-[#4A4A4A] leading-relaxed">
                        Découvre le chemin professionnel qui te correspond le mieux grâce à notre orientation personnalisée.
                    </p>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
                        <button 
                            onClick={handleStartNewOrientation}
                            className="bg-[#6A5ACD] text-white px-6 py-3 rounded-full hover:bg-[#5A4ACD] transition flex items-center justify-center"
                        >
                            <Play className="mr-2" /> Commencer mon orientation
                        </button>
                        {hasExistingDecision && (
                            <button 
                                onClick={handleViewExistingDecision}
                                className="border-2 border-[#6A5ACD] text-[#6A5ACD] px-6 py-3 rounded-full hover:bg-[#6A5ACD]/10 transition flex items-center justify-center"
                            >
                                <FileText className="mr-2" /> Ma fiche existante
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="services" className="py-16 bg-[#F5F5FA]">
                <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-12">
                    Nos Services
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {servicesData.map((service, index) => (
                    <Service
                        key={index}
                        icon={service.icon}
                        title={service.title}
                        description={service.description}
                    />
                    ))}
                </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-16">
                <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-12">
                    Témoignages
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial, index) => (
                    <Testimonial
                        key={index}
                        name={testimonial.name}
                        role={testimonial.role}
                        quote={testimonial.quote}
                    />
                    ))}
                </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-[#F5F5FA]">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">
                                Contactez-nous
                            </h2>
                            <p className="text-[#4A4A4A] mb-8">
                                Vous avez des questions ? N'hésitez pas à nous contacter. Nous sommes là pour vous aider.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Mail className="text-[#6A5ACD]" />
                                    <span>contact@decision.io</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <MapPin className="text-[#6A5ACD]" />
                                    <span>Paris, France</span>
                                </div>
                            </div>
                        </div>
                        <form className="bg-white p-8 rounded-2xl shadow-md">
                            <div className="mb-4">
                                <label className="block text-[#2C3E50] mb-2">Nom</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A5ACD]"
                                    placeholder="Votre nom"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-[#2C3E50] mb-2">Email</label>
                                <input 
                                    type="email" 
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A5ACD]"
                                    placeholder="Votre email"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-[#2C3E50] mb-2">Message</label>
                                <textarea 
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A5ACD]"
                                    rows="4"
                                    placeholder="Votre message"
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-[#6A5ACD] text-white py-3 rounded-full hover:bg-[#5A4ACD] transition"
                            >
                                Envoyer
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            {showUserInfoModal && (
                <UserInfoModal
                    onSubmit={handleUserInfoSubmit}
                    onExistingDecision={() => { }}
                />
            )}
        </div>
    );
};

export default CharlesPresentation;