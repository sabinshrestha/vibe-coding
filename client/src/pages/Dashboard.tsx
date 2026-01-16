import { API_BASE_URL } from "../config/api";
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

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

      // Calculate stats
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

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>{user?.role === 'freelancer' ? 'Freelancer Dashboard' : 'Client Dashboard'}</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        {user?.role === 'freelancer' && (
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '20px',
              borderRadius: '10px',
            }}
          >
            <h3>💰 Total Earnings</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
              ${stats.totalEarnings.toFixed(2)}
            </p>
          </div>
        )}
        <div
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <h3>📋 Active Orders</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
            {stats.activeOrders}
          </p>
        </div>
        <div
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <h3>✅ Completed</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
            {stats.completedOrders}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Recent Orders</h2>
        {orders.length > 0 ? (
          <div style={{ marginTop: '20px' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  marginBottom: '15px',
                  border: '1px solid #ddd',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0' }}>{order.title}</h3>
                    <p style={{ color: '#666', margin: '5px 0' }}>
                      {user?.role === 'freelancer' ? 'Client' : 'Freelancer'}:{' '}
                      {user?.role === 'freelancer'
                        ? order.clientId?.name
                        : order.freelancerId?.name}
                    </p>
                    <p style={{ color: '#999', fontSize: '14px', margin: '5px 0' }}>
                      Requirements: {order.requirements || 'N/A'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#667eea',
                        margin: '0 0 10px 0',
                      }}
                    >
                      ${order.price}
                    </p>
                    <span
                      style={{
                        padding: '5px 15px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background:
                          order.status === 'completed'
                            ? '#d4edda'
                            : order.status === 'in-progress'
                            ? '#fff3cd'
                            : '#d1ecf1',
                        color:
                          order.status === 'completed'
                            ? '#155724'
                            : order.status === 'in-progress'
                            ? '#856404'
                            : '#0c5460',
                      }}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666', marginTop: '20px' }}>No orders yet</p>
        )}
      </div>
    </div>
  );
};
