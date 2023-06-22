import * as yup from 'yup';

export const lessonPlanValidationSchema = yup.object().shape({
  name: yup.string().required(),
  course_offering_id: yup.string().nullable().required(),
});
