import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';

const Navbar = ({ onTalkToCoach }) => {
    const navigate = useNavigate();

    const handleNavigation = (section) => {
        // If not on home page, navigate to home first
        if (window.location.pathname !== '/') {
            navigate('/');
        }
        
        // Use setTimeout to ensure page load before scrolling
        setTimeout(() => {
            const element = document.getElementById(section);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const handleTalkToCoach = () => {
        if (onTalkToCoach) {
            onTalkToCoach();
        } else {
            navigate('/coaches');
        }
    };

    const handleLogoClick = () => {
        navigate('/');
        // Scroll to top of home page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <div 
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={handleLogoClick}
                >
                    <span className="text-2xl font-bold text-[#6A5ACD]">Décision</span>
                </div>
                <div className="hidden md:flex space-x-6">
                    <button 
                        onClick={() => handleNavigation('home')} 
                        className="text-[#4A4A4A] hover:text-[#6A5ACD] transition"
                    >
                        Accueil
                    </button>
                    <button 
                        onClick={() => handleNavigation('services')} 
                        className="text-[#4A4A4A] hover:text-[#6A5ACD] transition"
                    >
                        Services
                    </button>
                    <button 
                        onClick={() => handleNavigation('testimonials')} 
                        className="text-[#4A4A4A] hover:text-[#6A5ACD] transition"
                    >
                        Témoignages
                    </button>
                    <button 
                        onClick={() => handleNavigation('contact')} 
                        className="text-[#4A4A4A] hover:text-[#6A5ACD] transition"
                    >
                        Contact
                    </button>
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