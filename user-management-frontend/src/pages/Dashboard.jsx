import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const result = await adminService.getDashboardData();
      if (result.success) {
        setStats(result.data.stats);
        setRecentActivities(result.data.recentActivities);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.firstName}!</h1>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">User Statistics</h2>
            {stats ? (
              <ul className="mt-4">
                <li>Total Users: {stats.totalUsers}</li>
                <li>Admins: {stats.totalAdmins}</li>
                <li>Moderators: {stats.totalModerators}</li>
                <li>Active Users: {stats.activeUsers}</li>
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Recent Activities</h2>
            <ul className="mt-4 space-y-2">
              {recentActivities.length > 0 ? (
                recentActivities.map(activity => (
                  <li key={activity.id} className="text-sm text-gray-600">{activity.description}</li>
                ))
              ) : (
                <p>No recent activities.</p>
              )}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <nav className="flex flex-col space-y-2">
              <Link to="/users" className="text-blue-600 hover:underline">Manage Users</Link>
              <Link to="/settings" className="text-blue-600 hover:underline">Account Settings</Link>
              <Link to="/reports" className="text-blue-600 hover:underline">View Reports</Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

