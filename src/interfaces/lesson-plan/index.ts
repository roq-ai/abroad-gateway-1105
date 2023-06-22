import { CourseOfferingInterface } from 'interfaces/course-offering';
import { GetQueryInterface } from 'interfaces';

export interface LessonPlanInterface {
  id?: string;
  name: string;
  course_offering_id: string;
  created_at?: any;
  updated_at?: any;

  course_offering?: CourseOfferingInterface;
  _count?: {};
}

export interface LessonPlanGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  course_offering_id?: string;
}
