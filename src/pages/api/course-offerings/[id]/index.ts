import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { courseOfferingValidationSchema } from 'validationSchema/course-offerings';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.course_offering
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCourseOfferingById();
    case 'PUT':
      return updateCourseOfferingById();
    case 'DELETE':
      return deleteCourseOfferingById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCourseOfferingById() {
    const data = await prisma.course_offering.findFirst(convertQueryToPrismaUtil(req.query, 'course_offering'));
    return res.status(200).json(data);
  }

  async function updateCourseOfferingById() {
    await courseOfferingValidationSchema.validate(req.body);
    const data = await prisma.course_offering.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCourseOfferingById() {
    const data = await prisma.course_offering.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
