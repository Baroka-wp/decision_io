import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const RevenuePage = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Données de démonstration
  const monthlyData = [
    { name: 'Jan', revenue: 4500, clients: 15 },
    { name: 'Fév', revenue: 5200, clients: 18 },
    { name: 'Mar', revenue: 4800, clients: 16 },
    { name: 'Avr', revenue: 6000, clients: 20 },
    { name: 'Mai', revenue: 5500, clients: 19 },
    { name: 'Jun', revenue: 7000, clients: 25 },
  ];

  const stats = {
    totalRevenue: 33000,
    previousRevenue: 28000,
    averagePerClient: 280,
    totalClients: 113,
    bestMonth: 'Juin',
    revenueGrowth: 17.85
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-violet-600 mb-6">Mes revenus</h1>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Revenu total */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenu total</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.totalRevenue.toLocaleString()}€
                </h3>
              </div>
              <div className={`flex items-center ${
                stats.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {stats.revenueGrowth >= 0 ? (
                  <ArrowUpRight className="w-5 h-5" />
                ) : (
                  <ArrowDownRight className="w-5 h-5" />
                )}
                <span className="ml-1 font-medium">
                  {Math.abs(stats.revenueGrowth)}%
                </span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full">
              <div
                className="h-2 bg-fuschia-500 rounded-full"
                style={{ width: `${(stats.totalRevenue / 40000) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Moyenne par client */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm font-medium text-gray-600">Moyenne par client</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {stats.averagePerClient}€
            </h3>
            <div className="mt-4 flex items-center text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm">{stats.totalClients} clients</span>
            </div>
          </div>

          {/* Meilleur mois */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm font-medium text-gray-600">Meilleur mois</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {stats.bestMonth}
            </h3>
            <div className="mt-4 flex items-center text-green-500">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">7 000€</span>
            </div>
          </div>

          {/* Progression */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm font-medium text-gray-600">Progression</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              +{stats.revenueGrowth}%
            </h3>
            <div className="mt-4 flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="text-sm">vs mois dernier</span>
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution du revenu */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-violet-600 mb-4">
              Évolution du revenu
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D946EF" // Couleur fuschia
                    strokeWidth={2}
                    name="Revenu (€)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Nombre de clients */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-violet-600 mb-4">
              Nombre de clients
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="clients"
                    fill="#D946EF" // Couleur fuschia
                    name="Nombre de clients"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenuePage;