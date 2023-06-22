import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { courseOfferingValidationSchema } from 'validationSchema/course-offerings';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCourseOfferings();
    case 'POST':
      return createCourseOffering();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCourseOfferings() {
    const data = await prisma.course_offering
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'course_offering'));
    return res.status(200).json(data);
  }

  async function createCourseOffering() {
    await courseOfferingValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.lesson_plan?.length > 0) {
      const create_lesson_plan = body.lesson_plan;
      body.lesson_plan = {
        create: create_lesson_plan,
      };
    } else {
      delete body.lesson_plan;
    }
    const data = await prisma.course_offering.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
