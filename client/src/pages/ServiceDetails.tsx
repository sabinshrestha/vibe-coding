import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useAuthStore } from '../store/authStore';
import './ServiceDetails.css';

type Service = {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  rating: number;
  totalOrders: number;
  freelancerId?: {
    name?: string;
    rating?: number;
  };
  tags?: string[];
};

export const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/services/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setService(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, token]);

  if (loading) {
    return (
      <div className="service-details-container">
        <p>Loading service...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-details-container">
        <p className="error">{error || 'Service not found'}</p>
        <button className="back-btn" onClick={() => navigate('/services')}>Back to Services</button>
      </div>
    );
  }

  return (
    <div className="service-details-container">
      <button className="back-btn" onClick={() => navigate('/services')}>← Back to Services</button>

      <div className="service-details-card">
        <div className="service-details-header">
          <h1>{service.title}</h1>
          <span className="category">{service.category}</span>
        </div>

        <p className="description">{service.description}</p>

        <div className="service-meta">
          <div>
            <strong>Price:</strong> ${service.price}
          </div>
          <div>
            <strong>Delivery Time:</strong> {service.deliveryTime} days
          </div>
          <div>
            <strong>Rating:</strong> {service.rating?.toFixed(1)} ({service.totalOrders} orders)
          </div>
        </div>

        <div className="freelancer-info">
          <h3>Freelancer</h3>
          <p>{service.freelancerId?.name || 'Unknown'}</p>
        </div>

        {service.tags && service.tags.length > 0 && (
          <div className="tags">
            {service.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;
