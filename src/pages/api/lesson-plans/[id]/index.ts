import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { lessonPlanValidationSchema } from 'validationSchema/lesson-plans';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.lesson_plan
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getLessonPlanById();
    case 'PUT':
      return updateLessonPlanById();
    case 'DELETE':
      return deleteLessonPlanById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getLessonPlanById() {
    const data = await prisma.lesson_plan.findFirst(convertQueryToPrismaUtil(req.query, 'lesson_plan'));
    return res.status(200).json(data);
  }

  async function updateLessonPlanById() {
    await lessonPlanValidationSchema.validate(req.body);
    const data = await prisma.lesson_plan.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteLessonPlanById() {
    const data = await prisma.lesson_plan.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
