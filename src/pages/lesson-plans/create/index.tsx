import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createLessonPlan } from 'apiSdk/lesson-plans';
import { Error } from 'components/error';
import { lessonPlanValidationSchema } from 'validationSchema/lesson-plans';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CourseOfferingInterface } from 'interfaces/course-offering';
import { getCourseOfferings } from 'apiSdk/course-offerings';
import { LessonPlanInterface } from 'interfaces/lesson-plan';

function LessonPlanCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: LessonPlanInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createLessonPlan(values);
      resetForm();
      router.push('/lesson-plans');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<LessonPlanInterface>({
    initialValues: {
      name: '',
      course_offering_id: (router.query.course_offering_id as string) ?? null,
    },
    validationSchema: lessonPlanValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Lesson Plan
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CourseOfferingInterface>
            formik={formik}
            name={'course_offering_id'}
            label={'Select Course Offering'}
            placeholder={'Select Course Offering'}
            fetcher={getCourseOfferings}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'lesson_plan',
  operation: AccessOperationEnum.CREATE,
})(LessonPlanCreatePage);
