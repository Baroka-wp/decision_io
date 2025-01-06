import { useState } from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import { Clock, User, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);

  // Données de démonstration enrichies
  const appointments = [
    { 
      id: 1, 
      date: '2025-01-08', 
      time: '10:00 AM', 
      client: 'John Doe',
      type: 'Consultation',
      duration: '1h',
      status: 'confirmed'
    },
    { 
      id: 2, 
      date: '2025-01-08', 
      time: '2:00 PM', 
      client: 'Jane Smith',
      type: 'Suivi',
      duration: '30min',
      status: 'pending'
    },
    { 
      id: 3, 
      date: '2025-01-09', 
      time: '11:00 AM', 
      client: 'Alex Johnson',
      type: 'Première visite',
      duration: '1h30',
      status: 'confirmed'
    },
  ];

  const dailyAppointments = appointments.filter(
    (appt) => appt.date === selectedDate.toISOString().split('T')[0]
  );

  // Fonction pour styliser les tuiles du calendrier
  const tileClassName = ({ date }) => {
    const hasAppointment = appointments.some(
      appt => appt.date === date.toISOString().split('T')[0]
    );
    return hasAppointment ? 'has-appointment' : '';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-violet-600">Calendrier</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-fuschia-500 hover:bg-fuschia-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Nouveau rendez-vous</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Component */}
        <div className="calendar-container">
          <ReactCalendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="w-full border-0 shadow-md rounded-xl"
            tileClassName={tileClassName}
            prevLabel={<ChevronLeft className="text-gray-600" />}
            nextLabel={<ChevronRight className="text-gray-600" />}
          />
          
          {/* Custom styles for the calendar */}
          <style jsx global>{`
            .react-calendar {
              border: none;
              font-family: 'Inter', sans-serif;
            }
            .react-calendar__tile {
              padding: 1em 0.5em;
              position: relative;
            }
            .react-calendar__tile:enabled:hover,
            .react-calendar__tile:enabled:focus {
              background-color: #f0f9ff;
              border-radius: 8px;
            }
            .react-calendar__tile--active {
              background-color: #d946ef !important; /* Fuschia */
              border-radius: 8px;
            }
            .react-calendar__tile.has-appointment::after {
              content: '';
              position: absolute;
              bottom: 4px;
              left: 50%;
              transform: translateX(-50%);
              width: 6px;
              height: 6px;
              background-color: #d946ef; /* Fuschia */
              border-radius: 50%;
            }
          `}</style>
        </div>

        {/* Appointments Panel */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-violet-600 mb-4">
            Rendez-vous du {selectedDate.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>

          {dailyAppointments.length > 0 ? (
            <div className="space-y-4">
              {dailyAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="text-fuschia-500 w-5 h-5" />
                      <span className="font-semibold text-gray-800">{appt.time}</span>
                      <span className="text-gray-500">({appt.duration})</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appt.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appt.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <User className="text-gray-400 w-5 h-5" />
                    <span className="text-gray-700">{appt.client}</span>
                  </div>
                  
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-fuschia-50 text-fuschia-700 rounded-full text-sm">
                      {appt.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun rendez-vous prévu pour cette date.</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="mt-4 text-fuschia-500 hover:text-fuschia-600 font-medium"
              >
                Ajouter un rendez-vous
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Appointment Form Modal - à implémenter selon vos besoins */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-violet-600 mb-4">Nouveau rendez-vous</h3>
            {/* Formulaire à implémenter */}
            <button 
              onClick={() => setShowAddForm(false)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;