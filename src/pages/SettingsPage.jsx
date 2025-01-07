import React, { useState } from 'react';
import { 
  Bell, 
  Lock, 
  CreditCard,
  Globe,
  ChevronRight
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      appointments: true,
      marketing: false,
    },
    calendar: {
      defaultDuration: 60,
      workingHours: {
        start: '09:00',
        end: '18:00'
      },
      workingDays: [1, 2, 3, 4, 5], // Lundi à Vendredi
    },
    preferences: {
      language: 'fr',
      timeZone: 'Europe/Paris',
      currency: 'EUR'
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* <h1 className="text-2xl font-bold text-violet-600 mb-6">Paramètres</h1> */}

        {/* Navigation par onglets */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <nav className="flex border-b">
            {[
              { id: 'general', label: 'Général', icon: Globe },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Sécurité', icon: Lock },
              { id: 'billing', label: 'Facturation', icon: CreditCard }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative
                  ${activeTab === tab.id 
                    ? 'text-violet-600 border-b-2 border-violet-600' 
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Contenu des paramètres */}
          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-violet-600 mb-4">Préférences générales</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Langue</h4>
                        <p className="text-sm text-gray-600">Choisissez votre langue préférée</p>
                      </div>
                      <select 
                        value={settings.preferences.language}
                        onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-fuschia-500"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Fuseau horaire</h4>
                        <p className="text-sm text-gray-600">Votre fuseau horaire actuel</p>
                      </div>
                      <select 
                        value={settings.preferences.timeZone}
                        onChange={(e) => handleSettingChange('preferences', 'timeZone', e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-fuschia-500"
                      >
                        <option value="Europe/Paris">Paris (GMT+1)</option>
                        <option value="Europe/London">Londres (GMT)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Devise</h4>
                        <p className="text-sm text-gray-600">Devise par défaut pour la facturation</p>
                      </div>
                      <select 
                        value={settings.preferences.currency}
                        onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-fuschia-500"
                      >
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-violet-600 mb-4">Calendrier</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Durée par défaut</h4>
                        <p className="text-sm text-gray-600">Durée par défaut des rendez-vous</p>
                      </div>
                      <select 
                        value={settings.calendar.defaultDuration}
                        onChange={(e) => handleSettingChange('calendar', 'defaultDuration', parseInt(e.target.value))}
                        className="p-2 border rounded-lg focus:ring-2 focus:ring-fuschia-500"
                      >
                        <option value="30">30 minutes</option>
                        <option value="60">1 heure</option>
                        <option value="90">1 heure 30</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Heures de travail</h4>
                        <p className="text-sm text-gray-600">Définissez vos heures de disponibilité</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={settings.calendar.workingHours.start}
                          onChange={(e) => handleSettingChange('calendar', 'workingHours', {
                            ...settings.calendar.workingHours,
                            start: e.target.value
                          })}
                          className="p-2 border rounded-lg focus:ring-2 focus:ring-fuschia-500"
                        />
                        <span>à</span>
                        <input
                          type="time"
                          value={settings.calendar.workingHours.end}
                          onChange={(e) => handleSettingChange('calendar', 'workingHours', {
                            ...settings.calendar.workingHours,
                            end: e.target.value
                          })}
                          className="p-2 border rounded-lg focus:ring-2 focus:ring-fuschia-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-violet-600 mb-4">Préférences de notification</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Notifications par email</h4>
                      <p className="text-sm text-gray-600">Recevoir des notifications par email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuschia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuschia-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Notifications SMS</h4>
                      <p className="text-sm text-gray-600">Recevoir des notifications par SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.sms}
                        onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuschia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuschia-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">Rappels de rendez-vous</h4>
                      <p className="text-sm text-gray-600">Notifications pour les rendez-vous à venir</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.appointments}
                        onChange={(e) => handleSettingChange('notifications', 'appointments', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuschia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuschia-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-violet-600 mb-4">Sécurité du compte</h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-800">Modifier le mot de passe</h4>
                      <p className="text-sm text-gray-600">Changez votre mot de passe actuel</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-800">Authentification à deux facteurs</h4>
                      <p className="text-sm text-gray-600">Ajoutez une couche de sécurité supplémentaire</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-800">Sessions actives</h4>
                      <p className="text-sm text-gray-600">Gérez vos appareils connectés</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-violet-600 mb-4">Informations de facturation</h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-800">Méthodes de paiement</h4>
                      <p className="text-sm text-gray-600">Gérez vos cartes de paiement</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-800">Historique des factures</h4>
                      <p className="text-sm text-gray-600">Consultez vos factures précédentes</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-800">Abonnement</h4>
                      <p className="text-sm text-gray-600">Gérez votre abonnement et vos options</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;