# 💰 Vibe Marketplace - Freelance Services Platform

A full-stack freelance marketplace where you can **make money** by offering services or hiring talented freelancers.

## 🚀 Features

### For Freelancers (Make Money!)
- ✅ Create and manage service listings
- ✅ Set your own prices and delivery times
- ✅ Accept orders from clients
- ✅ Earn money from completed work
- ✅ Build your reputation with ratings

### For Clients
- ✅ Browse thousands of services
- ✅ Filter by category
- ✅ Hire freelancers instantly
- ✅ Track order progress
- ✅ Leave reviews

### Platform Features
- 🔐 Secure authentication (JWT)
- 💳 Payment integration ready (Stripe)
- ⭐ Rating & review system
- 📊 Dashboard analytics
- 🎨 Modern, responsive UI

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (blazing fast dev server)
- Zustand (state management)
- Axios (API calls)
- React Router

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
- Stripe for payments

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB installed and running locally OR MongoDB Atlas account

### Setup Instructions

1. **Clone and navigate to the project**
```bash
cd /workspaces/vibe-coding
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Configure environment variables**
```bash
# In the server directory
cd server
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB** (if using local MongoDB)
```bash
mongod
```

5. **Start the development servers**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

6. **Access the app**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 💡 How to Make Money

### As a Freelancer:

1. **Register** as a freelancer
2. **Create services** - Describe what you can do (web design, writing, video editing, etc.)
3. **Set your price** - You control how much you earn
4. **Get hired** - Clients will find your services
5. **Deliver work** - Complete orders and get paid
6. **Build reputation** - Good reviews = more orders = more money! 💵

### Service Ideas to Get Started:
- 🎨 Logo design - $50-$500
- 💻 Website development - $200-$5000
- ✍️ Content writing - $20-$200
- 🎬 Video editing - $50-$500
- 📱 Social media management - $100-$1000/month

## 📁 Project Structure

```
vibe-coding/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   └── package.json
├── server/                # Backend API
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   ├── utils/         # Helper functions
│   │   └── index.ts       # Server entry point
│   └── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service details
- `POST /api/services` - Create service (auth required)
- `PUT /api/services/:id` - Update service (auth required)
- `DELETE /api/services/:id` - Delete service (auth required)

### Orders
- `GET /api/orders` - Get user's orders (auth required)
- `GET /api/orders/:id` - Get order details (auth required)
- `POST /api/orders` - Create order (auth required)
- `PUT /api/orders/:id/status` - Update order status (auth required)
- `POST /api/orders/:id/review` - Submit review (auth required)

## 🎯 Roadmap

- [ ] Stripe payment integration
- [ ] Real-time chat between clients & freelancers
- [ ] File upload for deliverables
- [ ] Advanced search & filters
- [ ] Freelancer portfolio pages
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Subscription tiers

## 💳 Monetization Strategy

As the platform owner, you can earn through:
1. **Service fees** - Take 10-20% commission on each transaction
2. **Featured listings** - Charge freelancers to promote their services
3. **Premium subscriptions** - Offer enhanced features
4. **Advertising** - Display ads to users

## 🤝 Contributing

Feel free to fork, improve, and create pull requests!

## 📄 License

MIT License - Feel free to use this for your own money-making venture!

---

**Ready to start making money?** 🚀

Register as a freelancer today and start earning!