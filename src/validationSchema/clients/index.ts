import * as yup from 'yup';

export const clientValidationSchema = yup.object().shape({
  name: yup.string().required(),
  visa_application_status: yup.string().required(),
  required_documents: yup.string(),
  visa_consultant_id: yup.string().nullable().required(),
});
