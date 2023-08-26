'use client'
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { postCommentByPost } from '@/lib/sanity/client';

interface SubmitMessageProps {
  message: {
    text: string;
    success: boolean;
  };
}

function SubmitMessage({ message }: SubmitMessageProps) {
  return (
    <div id="submitMessage" className={message.success ? 'success' : 'error'}>
      {message.text}
    </div>
  );
}

interface AddCommentFormProps {
  parentCommentId: string | null;
  firstParentId: string | null;
  _id: string;
}

export default function AddCommentForm({
  parentCommentId,
  firstParentId,
  _id,
}: AddCommentFormProps) {
 // console.log(`first`, _id);
  const [submitMessage, setSubmitMessage] = useState<null | SubmitMessageProps['message']>(null);
  const [isSending, setIsSending] = useState(false);

  const initialValues = {
    _type: 'comment',
    name: '',
    email: '',
    comment: '',
    approved: true,
    post: {
      _ref: _id,
      _type: 'reference',
    },
    parentCommentId: parentCommentId || null,
    firstParentId: firstParentId || null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().max(80, 'Your name must be at most 80 characters'),
    email: Yup.string().email('Invalid email'),
    comment: Yup.string().required('You need to write something').max(5000, 'Comment is too long'),
  });

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    setIsSending(true);

    try {
      console.log(values);
      const response:any = await postCommentByPost(values);
      console.log(response);
      let responseMessage = '';
      let responseSuccess = false;

      if (response && response?.message) {
        responseMessage = response?.message;
        responseSuccess = response?.status === 200;
      } else {
        responseMessage = 'An error occurred while submitting the comment.';
      }

      setSubmitMessage({
        text: responseMessage,
        success: responseSuccess,
      });
      setTimeout(() => {
        setSubmitMessage(null);
        resetForm();
      }, 2000);
    } catch (error) {
      console.log(error);
      setSubmitMessage({
        text: String(error.message),
        success: false,
      });

      setTimeout(() => {
        setSubmitMessage(null);
      }, 2000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {submitMessage && <SubmitMessage message={submitMessage} />}
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        <Form className="flex flex-col">
          <Field
            className="my-1 rounded-md border px-5 py-2"
            type="text"
            placeholder="Name (Optional)"
            name="name"
          />
          <ErrorMessage name="name" component="span" className="error" />

          <Field
            className="my-1 rounded-md border px-5 py-2"
            type="text"
            placeholder="Email (Optional)"
            name="email"
          />
          <ErrorMessage name="email" component="span" className="error" />

          <Field
            className="my-1 rounded-md border px-5 py-2"
            as="textarea"
            name="comment"
            placeholder="Your Comment (Supports Markdown)"
            rows="5"
          />
          <ErrorMessage name="comment" component="span" className="error" />

          <button
            className="my-1 rounded-md border px-5 py-2 hover:bg-blue-100 hover:text-gray-900"
            type="submit"
            disabled={isSending}>
            {isSending ? 'Sending Comment...' : 'Send Comment'}
          </button>
        </Form>
      </Formik>
    </>
  );
}
