import { Router, Request, Response } from 'express';
import Service from '../models/Service';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Create service
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, description, category, price, deliveryTime, revisions, tags } = req.body;

    const service = new Service({
      title,
      description,
      category,
      price,
      deliveryTime,
      revisions,
      tags,
      freelancerId: req.userId,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Get all services
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, searchTerm } = req.query;

    let query: any = { isActive: true };

    if (category) query.category = category;
    if (searchTerm) query.$text = { $search: searchTerm as string };

    const services = await Service.find(query).populate('freelancerId', 'name rating');

    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get service by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      'freelancerId',
      'name bio rating skills'
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Update service
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (service.freelancerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    Object.assign(service, req.body);
    await service.save();

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (service.freelancerId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
