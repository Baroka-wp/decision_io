// import React from 'react'

// export default function Testimonial() {
//   return (
//     <div>
//         <section id="testimonials" className="py-16">
//         <div className="max-w-6xl mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-12">
//             Témoignages
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 name: "Marie Dupont",
//                 role: "Étudiante en Marketing",
//                 quote:
//                   "Grâce à Décision, j'ai trouvé ma voie et je me sens enfin en confiance pour mon avenir.",
//               },
//               {
//                 name: "Jean Martin",
//                 role: "Lycéen",
//                 quote:
//                   "Le coaching m'a aidé à comprendre mes véritables passions et compétences.",
//               },
//               {
//                 name: "Sophie Leroy",
//                 role: "Future Ingénieure",
//                 quote:
//                   "Un service incroyablement personnalisé qui m'a guidée vers ma carrière de rêve.",
//               },
//             ].map((testimonial, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
//               >
//                 <div className="flex items-center mb-4">
//                   <div>
//                     <h3 className="font-semibold text-[#2C3E50]">
//                       {testimonial.name}
//                     </h3>
//                     <p className="text-sm text-[#4A4A4A]">{testimonial.role}</p>
//                   </div>
//                 </div>
//                 <p className="italic text-[#4A4A4A]">"{testimonial.quote}"</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }
import React from 'react';

const TestimonialCard = ({ name, role, quote }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
      <div className="flex items-center mb-4">
        <div>
          <h3 className="font-semibold text-[#2C3E50]">{name}</h3>
          <p className="text-sm text-[#4A4A4A]">{role}</p>
        </div>
      </div>
      <p className="italic text-[#4A4A4A]">"{quote}"</p>
    </div>
  );
};

export default TestimonialCard;
