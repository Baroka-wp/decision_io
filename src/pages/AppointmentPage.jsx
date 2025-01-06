import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, Clock, User, MapPin, Phone, Mail, MoreVertical, Check, X, ArrowRight } from 'lucide-react';

const AppointmentPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const appointments = [
    {
      id: 1,
      client: 'Sophie Martin',
      date: '2025-01-08',
      time: '10:00',
      duration: '1h',
      type: 'Consultation',
      status: 'confirmed',
      location: 'En ligne',
      phone: '+33 6 12 34 56 78',
      email: 'sophie.m@email.com',
      notes: 'Première séance de coaching'
    },
    {
      id: 2,
      client: 'Pierre Dubois',
      date: '2025-01-08',
      time: '14:30',
      duration: '45min',
      type: 'Suivi',
      status: 'pending',
      location: 'Cabinet',
      phone: '+33 6 98 76 54 32',
      email: 'pierre.d@email.com',
      notes: 'Bilan mensuel'
    },
    // Ajoutez plus de rendez-vous ici
  ];

  const filteredAppointments = appointments.filter(app => 
    (filterStatus === 'all' || app.status === filterStatus) &&
    app.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mes rendez-vous</h1>
          
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
            Nouveau rendez-vous
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filterStatus === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Tous' :
                   status === 'confirmed' ? 'Confirmés' :
                   status === 'pending' ? 'En attente' : 'Annulés'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des rendez-vous */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {appointment.client}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status === 'confirmed' ? 'Confirmé' :
                         appointment.status === 'pending' ? 'En attente' : 'Annulé'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(appointment.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time} ({appointment.duration})</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{appointment.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {appointment.status === 'pending' && (
                      <>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Check className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                      <span>Détails</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;