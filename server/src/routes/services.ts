import { Router, Request, Response } from 'express';
import Service from '../models/Service';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - price
 *               - deliveryTime
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               deliveryTime:
 *                 type: number
 *               revisions:
 *                 type: number
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Service created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to create service
 */
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

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 **
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 *       500:
 *         description: Failed to fetch service
 */
/*       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Failed to fetch services
 */
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
