import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { sendSuccess } from '../utils/response.js';

export const contactRouter = Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters long'),
});

// POST /api/contact
contactRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = contactSchema.parse(req.body);

    const message = await prisma.contactMessage.create({
      data: {
        name: validated.name.trim(),
        email: validated.email.toLowerCase().trim(),
        subject: validated.subject?.trim() || 'Concierge Inquiry',
        message: validated.message.trim(),
      },
    });

    sendSuccess(
      res,
      { id: message.id },
      201,
      'Your dispatch has been received by the Chem Bros Concierge.'
    );
  } catch (error) {
    next(error);
  }
});
