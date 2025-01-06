import React, { useState } from 'react';
import { Camera, Mail, Phone, MapPin, Calendar, Award, Briefcase, Edit2, X, Check, UserPlus } from 'lucide-react';

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+1234567890',
    location: 'Paris, France',
    joinDate: 'Janvier 2023',
    bio: 'Coach motivateur passionné par l\'épanouissement personnel et professionnel.',
    expertise: ['Développement personnel', 'Leadership', 'Gestion du stress'],
    education: [
      {
        degree: 'Master en Psychologie',
        school: 'Université de Paris',
        year: '2018'
      }
    ],
    certifications: [
      {
        name: 'Coach Professionnel Certifié',
        issuer: 'ICF',
        year: '2020'
      }
    ],
    experience: [
      {
        title: 'Coach Senior',
        company: 'Life Coaching Inc.',
        period: '2019 - Présent'
      }
    ],
    profilePicture: '/api/placeholder/150/150'
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setEditMode(false);
    // Logique de mise à jour du profil
  };

  const cancelEdit = () => {
    setEditMode(false);
    // Réinitialiser les modifications
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* En-tête du profil */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-fuschia-500 to-violet-500"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-4">
              <div className="relative w-32 h-32 md:mb-0">
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-full h-full rounded-2xl object-cover border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-2 right-2 bg-fuschia-500 hover:bg-fuschia-600 text-white rounded-full p-2 shadow-lg transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    {editMode ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="text-3xl font-bold text-gray-800 border-b-2 focus:border-fuschia-500 outline-none"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
                    )}
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-1" />
                        {profile.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-1" />
                        {profile.phone}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.location}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex gap-3">
                    {editMode ? (
                      <>
                        <button
                          onClick={handleProfileUpdate}
                          className="flex items-center gap-2 bg-fuschia-500 hover:bg-fuschia-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Enregistrer
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Annuler
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Modifier le profil
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation par onglets */}
            <div className="border-b">
              <nav className="flex gap-6">
                {['about', 'experience', 'education'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-2 font-medium transition-colors relative ${
                      activeTab === tab
                        ? 'text-violet-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Section principale */}
          <div className="md:col-span-2 space-y-6">
            {activeTab === 'about' && (
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold text-violet-600 mb-4">À propos</h2>
                {editMode ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-fuschia-500 focus:border-fuschia-500 outline-none"
                    rows="4"
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                )}

                <h3 className="text-lg font-semibold text-violet-600 mt-6 mb-3">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-fuschia-50 text-fuschia-600 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold text-violet-600 mb-4">Expérience professionnelle</h2>
                {profile.experience.map((exp, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-fuschia-500" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{exp.title}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.period}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'education' && (
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-semibold text-violet-600 mb-4">Formation</h2>
                {profile.education.map((edu, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-fuschia-500" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.school}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <h2 className="text-xl font-semibold text-violet-600 mt-8 mb-4">Certifications</h2>
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-fuschia-500" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                        <p className="text-gray-600">{cert.issuer}</p>
                        <p className="text-sm text-gray-500">{cert.year}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Barre latérale */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-lg font-semibold text-violet-600 mb-4">Informations</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Membre depuis</p>
                    <p className="text-gray-700">{profile.joinDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Clients suivis</p>
                    <p className="text-gray-700">150+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;