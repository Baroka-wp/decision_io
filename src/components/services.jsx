// import React from 'react'
// import {
//     FileText,
//     MessageCircle,
//     Briefcase,
// } from "lucide-react";

// export default function Services() {
//   return (
//     <div>
//         <section id="services" className="py-16 bg-[#F5F5FA]">
//         <div className="max-w-6xl mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-12">
//             Nos Services
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: <Briefcase className="text-[#6A5ACD]" size={48} />,
//                 title: "Orientation Personnalisée",
//                 description:
//                   "Une analyse approfondie pour découvrir votre voie professionnelle idéale.",
//               },
//               {
//                 icon: <FileText className="text-[#6A5ACD]" size={48} />,
//                 title: "Rapport Détaillé",
//                 description:
//                   "Un document complet sur vos compétences et opportunités de carrière.",
//               },
//               {
//                 icon: <MessageCircle className="text-[#6A5ACD]" size={48} />,
//                 title: "Coaching Individuel",
//                 description:
//                   "Des conseils personnalisés pour affiner votre parcours professionnel.",
//               },
//             ].map((service, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
//               >
//                 <div className="mb-4">{service.icon}</div>
//                 <h3 className="text-xl font-semibold mb-2 text-[#2C3E50]">
//                   {service.title}
//                 </h3>
//                 <p className="text-[#4A4A4A]">{service.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

import React from 'react';

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-[#2C3E50]">{title}</h3>
      <p className="text-[#4A4A4A]">{description}</p>
    </div>
  );
};

export default ServiceCard;

