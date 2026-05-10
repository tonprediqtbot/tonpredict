import { Activity, Users, DollarSign, Settings } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-blue-400">TonBet Admin</h1>
        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-600/20 text-blue-400 rounded-lg">
            <Activity className="w-5 h-5" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition">
            <Users className="w-5 h-5" />
            Users
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition">
            <DollarSign className="w-5 h-5" />
            Markets
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition">
            <Settings className="w-5 h-5" />
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-medium mb-2">Total Volume</h3>
            <p className="text-3xl font-bold text-slate-800">45,231 TON</p>
            <span className="text-green-500 text-sm font-medium mt-2 block">+12.5% this week</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-medium mb-2">Active Markets</h3>
            <p className="text-3xl font-bold text-slate-800">124</p>
            <span className="text-green-500 text-sm font-medium mt-2 block">+5 new today</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-slate-800">8,492</p>
            <span className="text-green-500 text-sm font-medium mt-2 block">+142 this week</span>
          </div>
        </div>

        {/* Recent Markets Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Recent Markets</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              Create Market
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Market Title</th>
                <th className="px-6 py-4 font-medium">Volume</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 text-slate-800">Will TON reach $10 before 2025?</td>
                <td className="px-6 py-4 text-slate-600">12.5K TON</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Manage</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-800">Who will win the Champions League 2024?</td>
                <td className="px-6 py-4 text-slate-600">45.2K TON</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Manage</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
