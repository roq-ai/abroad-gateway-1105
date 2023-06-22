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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getLessonPlanById, updateLessonPlanById } from 'apiSdk/lesson-plans';
import { Error } from 'components/error';
import { lessonPlanValidationSchema } from 'validationSchema/lesson-plans';
import { LessonPlanInterface } from 'interfaces/lesson-plan';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CourseOfferingInterface } from 'interfaces/course-offering';
import { getCourseOfferings } from 'apiSdk/course-offerings';

function LessonPlanEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<LessonPlanInterface>(
    () => (id ? `/lesson-plans/${id}` : null),
    () => getLessonPlanById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: LessonPlanInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateLessonPlanById(id, values);
      mutate(updated);
      resetForm();
      router.push('/lesson-plans');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<LessonPlanInterface>({
    initialValues: data,
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
            Edit Lesson Plan
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'lesson_plan',
  operation: AccessOperationEnum.UPDATE,
})(LessonPlanEditPage);
