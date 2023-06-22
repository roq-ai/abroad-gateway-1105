const mapping: Record<string, string> = {
  clients: 'client',
  'course-offerings': 'course_offering',
  'lesson-plans': 'lesson_plan',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
