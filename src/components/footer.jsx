import React from 'react'
import { 
    ChevronLeft, Home, Play, FileText, PhoneCall, 
    User, Briefcase, MessageCircle, 
    Mail, MapPin, Linkedin, Twitter, Instagram 
} from 'lucide-react';

export default function Foooter() {
  return (
    <div>
        {/* Footer */}
<footer className="bg-[#2C3E50] text-white py-12">
<div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
  <div>
    <h3 className="text-2xl font-bold mb-4">Décision</h3>
    <p className="text-[#A0A0A0]">
      Votre partenaire pour une orientation professionnelle réussie.
    </p>
  </div>
  <div>
    <h4 className="font-semibold mb-4">Liens Rapides</h4>
    <ul className="space-y-2">
      <li>
        <a href="#home" className="hover:text-[#6A5ACD] transition">
          Accueil
        </a>
      </li>
      <li>
        <a href="#services" className="hover:text-[#6A5ACD] transition">
          Services
        </a>
      </li>
      <li>
        <a
          href="#testimonials"
          className="hover:text-[#6A5ACD] transition"
        >
          Témoignages
        </a>
      </li>
      <li>
        <a href="#contact" className="hover:text-[#6A5ACD] transition">
          Contact
        </a>
      </li>
    </ul>
  </div>
  <div>
    <h4 className="font-semibold mb-4">Suivez-nous</h4>
    <div className="flex space-x-4">
      <a href="#" className="hover:text-[#6A5ACD] transition">
        <Linkedin />
      </a>
      <a href="#" className="hover:text-[#6A5ACD] transition">
        <Twitter />
      </a>
      <a href="#" className="hover:text-[#6A5ACD] transition">
        <Instagram />
      </a>
    </div>
  </div>
</div>
<div className="text-center mt-8 text-[#A0A0A0] text-sm">
  2024 Décision. Tous droits réservés.
</div>
</footer>
    </div>
  )
}
