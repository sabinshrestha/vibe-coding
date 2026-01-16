import { Router, Request, Response } from 'express';
import Order from '../models/Order';
import Service from '../models/Service';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Create order
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { serviceId, requirements } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const order = new Order({
      serviceId,
      freelancerId: service.freelancerId,
      clientId: req.userId,
      title: service.title,
      price: service.price,
      requirements,
      deliveryDate: new Date(Date.now() + service.deliveryTime * 24 * 60 * 60 * 1000),
    });

    await order.save();

    service.totalOrders += 1;
    await service.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get orders (for client and freelancer)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({
      $or: [{ clientId: req.userId }, { freelancerId: req.userId }],
    })
      .populate('serviceId')
      .populate('freelancerId', 'name')
      .populate('clientId', 'name');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('serviceId')
      .populate('freelancerId', 'name email')
      .populate('clientId', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (
      order.clientId._id?.toString() !== req.userId &&
      order.freelancerId._id?.toString() !== req.userId
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
router.put('/:id/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.freelancerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Submit review
router.post('/:id/review', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.clientId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    order.review = {
      rating,
      comment,
      createdAt: new Date(),
    };

    await order.save();

    // Update service rating
    const service = await Service.findById(order.serviceId);
    if (service) {
      const allOrders = await Order.find({ serviceId: order.serviceId, 'review.rating': { $exists: true } });
      const avgRating =
        allOrders.reduce((sum, o) => sum + (o.review?.rating || 0), 0) / allOrders.length;
      service.rating = avgRating;
      await service.save();
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

export default router;
