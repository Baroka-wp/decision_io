import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';

const Navbar = ({ onTalkToCoach }) => {
    const navigate = useNavigate();

    const handleTalkToCoach = () => {
        if (onTalkToCoach) {
            onTalkToCoach();
        } else {
            navigate('/coaches');
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-[#6A5ACD]">Décision</span>
                </div>
                <div className="hidden md:flex space-x-6">
                    <a href="/" className="text-[#4A4A4A] hover:text-[#6A5ACD] transition">Accueil</a>
                    <a href="#services" className="text-[#4A4A4A] hover:text-[#6A5ACD] transition">Services</a>
                    <a href="#testimonials" className="text-[#4A4A4A] hover:text-[#6A5ACD] transition">Témoignages</a>
                    <a href="#contact" className="text-[#4A4A4A] hover:text-[#6A5ACD] transition">Contact</a>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={handleTalkToCoach}
                        className="bg-[#6A5ACD] text-white px-4 py-2 rounded-full hover:bg-[#5A4ACD] transition flex items-center"
                    >
                        <PhoneCall size={16} className="mr-2" />
                        Parler à un Mentor
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
