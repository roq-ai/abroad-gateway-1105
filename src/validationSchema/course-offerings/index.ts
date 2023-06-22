import * as yup from 'yup';

export const courseOfferingValidationSchema = yup.object().shape({
  name: yup.string().required(),
  instructor_id: yup.string().nullable().required(),
  organization_id: yup.string().nullable().required(),
});
