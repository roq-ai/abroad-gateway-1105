import { LessonPlanInterface } from 'interfaces/lesson-plan';
import { UserInterface } from 'interfaces/user';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface CourseOfferingInterface {
  id?: string;
  name: string;
  instructor_id: string;
  organization_id: string;
  created_at?: any;
  updated_at?: any;
  lesson_plan?: LessonPlanInterface[];
  user?: UserInterface;
  organization?: OrganizationInterface;
  _count?: {
    lesson_plan?: number;
  };
}

export interface CourseOfferingGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  instructor_id?: string;
  organization_id?: string;
}
