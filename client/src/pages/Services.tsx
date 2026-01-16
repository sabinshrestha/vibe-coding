import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import './Services.css';

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  freelancerId: any;
  rating: number;
  totalOrders: number;
  deliveryTime: number;
}

export const ServiceBrowse: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchServices();
  }, [category]);

  const fetchServices = async () => {
    try {
      let query = 'http://localhost:5000/api/services';
      if (category) query += `?category=${category}`;

      const response = await axios.get(query, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Web Development', 'Design', 'Writing', 'Video Editing', 'Marketing'];

  return (
    <div className="services-container">
      <div className="services-header">
        <h1>Browse Services</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="services-content">
        <div className="filters">
          <h3>Categories</h3>
          {categories.map((cat) => (
            <label key={cat}>
              <input
                type="radio"
                name="category"
                value={cat}
                checked={category === cat}
                onChange={(e) => setCategory(e.target.value)}
              />
              {cat}
            </label>
          ))}
          {category && (
            <button onClick={() => setCategory('')}>Clear Filter</button>
          )}
        </div>

        <div className="services-grid">
          {loading ? (
            <p>Loading services...</p>
          ) : services.length > 0 ? (
            services.map((service) => (
              <div key={service._id} className="service-card">
                <div className="service-header">
                  <h3>{service.title}</h3>
                  <p className="category">{service.category}</p>
                </div>
                <p className="description">{service.description.substring(0, 100)}...</p>
                <div className="service-info">
                  <div className="freelancer">
                    <strong>{service.freelancerId.name}</strong>
                    <div className="rating">
                      ⭐ {service.rating.toFixed(1)} ({service.totalOrders} orders)
                    </div>
                  </div>
                  <div className="price">
                    <strong>${service.price}</strong>
                    <p>{service.deliveryTime} days delivery</p>
                  </div>
                </div>
                <button className="cta-btn">View Details</button>
              </div>
            ))
          ) : (
            <p>No services found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const FreelancerDashboard: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    price: '',
    deliveryTime: '5',
    revisions: '2',
    tags: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/services',
        {
          ...formData,
          price: parseFloat(formData.price),
          deliveryTime: parseInt(formData.deliveryTime),
          revisions: parseInt(formData.revisions),
          tags: formData.tags.split(',').map((tag) => tag.trim()),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'Web Development',
        price: '',
        deliveryTime: '5',
        revisions: '2',
        tags: '',
      });
      // Refresh services list
    } catch (error) {
      console.error('Failed to create service', error);
    }
  };

  return (
    <div className="freelancer-dashboard">
      <h1>Freelancer Dashboard</h1>
      <button onClick={() => setShowForm(!showForm)} className="create-service-btn">
        {showForm ? 'Cancel' : 'Create Service'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="service-form">
          <h3>Create New Service</h3>
          <input
            type="text"
            name="title"
            placeholder="Service Title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Service Description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <select name="category" value={formData.category} onChange={handleInputChange}>
            <option value="Web Development">Web Development</option>
            <option value="Design">Design</option>
            <option value="Writing">Writing</option>
            <option value="Video Editing">Video Editing</option>
            <option value="Marketing">Marketing</option>
          </select>
          <input
            type="number"
            name="price"
            placeholder="Price ($)"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="deliveryTime"
            placeholder="Delivery Time (days)"
            value={formData.deliveryTime}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="revisions"
            placeholder="Number of Revisions"
            value={formData.revisions}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated)"
            value={formData.tags}
            onChange={handleInputChange}
          />
          <button type="submit">Create Service</button>
        </form>
      )}
    </div>
  );
};
