import { API_BASE_URL } from "../config/api";
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import './Dashboard.css';

interface Order {
  _id: string;
  title: string;
  price: number;
  status: string;
  deliveryDate: string;
  clientId: any;
  freelancerId: any;
  requirements: string;
}

export const Dashboard: React.FC = () => {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);

      const completed = response.data.filter((o: Order) => o.status === 'completed');
      const active = response.data.filter(
        (o: Order) => o.status === 'pending' || o.status === 'in-progress'
      );
      const earnings = completed.reduce((sum: number, o: Order) => sum + o.price, 0);

      setStats({
        totalEarnings: earnings,
        activeOrders: active.length,
        completedOrders: completed.length,
      });
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const getStatusStyle = (status: string) => {
    if (status === 'completed') return { background: '#d4edda', color: '#155724' };
    if (status === 'in-progress') return { background: '#fff3cd', color: '#856404' };
    return { background: '#d1ecf1', color: '#0c5460' };
  };

  return (
    <div className="dashboard-container">
      <h1>{user?.role === 'freelancer' ? 'Freelancer Dashboard' : 'Client Dashboard'}</h1>

      <div className="dashboard-stats">
        {user?.role === 'freelancer' && (
          <div className="stat-card stat-card-earnings">
            <h3>Total Earnings</h3>
            <p className="stat-value">${stats.totalEarnings.toFixed(2)}</p>
          </div>
        )}
        <div className="stat-card stat-card-active">
          <h3>Active Orders</h3>
          <p className="stat-value">{stats.activeOrders}</p>
        </div>
        <div className="stat-card stat-card-completed">
          <h3>Completed</h3>
          <p className="stat-value">{stats.completedOrders}</p>
        </div>
      </div>

      <div className="dashboard-orders">
        <h2>Recent Orders</h2>
        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-content">
                  <div>
                    <h3 className="order-title">{order.title}</h3>
                    <p className="order-meta">
                      {user?.role === 'freelancer' ? 'Client' : 'Freelancer'}:{' '}
                      {user?.role === 'freelancer'
                        ? order.clientId?.name
                        : order.freelancerId?.name}
                    </p>
                    <p className="order-requirements">
                      Requirements: {order.requirements || 'N/A'}
                    </p>
                  </div>
                  <div className="order-price-status">
                    <p className="order-price">${order.price}</p>
                    <span
                      className="order-status-badge"
                      style={getStatusStyle(order.status)}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-orders">No orders yet</p>
        )}
      </div>
    </div>
  );
};
