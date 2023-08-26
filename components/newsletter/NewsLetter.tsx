'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
// import Confetti from 'react-confetti'

type Props = {}
const requiredSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required')
})

export default function NewsLetter({}: Props) {
  const [status, setStatus] = useState<number | null>(null)
  const [message, setMessage] = useState<string>('')
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [run, setRun] = useState<boolean>(false)
  const [totalCounts, setTotalCounts] = useState<number>(400)
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  })
  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window
    setDimensions({
      width,
      height
    })
  }, [])

  return (
    <>
      {/* {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={totalCounts}
          run={run}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )} */}
      <div className="mx-auto my-10 w-full space-y-5 rounded-xl bg-white p-5 shadow-md dark:bg-gray-900 md:max-w-3xl md:p-6">
        {/* Header and description */}
        <div className="space-y-3 pb-2">
          <h1 className="sm:text-2.5xl text-2xl font-black dark:text-white">Subscribe to Newsletter!</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Receive notifications of high-quality articles about frontend development and other relevant
            topics delivered straight to your inbox. You will receive a monthly email from me, ensuring a
            spam-free experience.
          </p>
        </div>

        {/* Formik */}
        <Formik
          initialValues={{
            email: ''
          }}
          validationSchema={requiredSchema}
          onSubmit={async (values, { resetForm }) => {
            setButtonDisabled(true)
            try {
              const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  email: values?.email
                })
              })
              const datas = await response.json()
              if (datas.status >= 400) {
                setStatus(datas.status)
                setMessage('You all ready joined the newsletter. ')
                setTimeout(() => {
                  setMessage('')
                  setButtonDisabled(false)
                }, 2000)
                return
              }

              setStatus(201)
              setMessage('Thank you for subscribing my newsletter 👻.')
              setShowConfetti(true)
              setRun(true)
              setTimeout(() => {
                setTotalCounts(0)
                setMessage('')
                resetForm()
                setButtonDisabled(false)
              }, 4000)
              setTotalCounts(400)
            } catch (error) {
              setStatus(500)
              setMessage('Error joining the newsletter.')
              setTimeout(() => {
                setMessage('')
                setButtonDisabled(false)
              }, 3000)
            }
          }}>
          <Form>
            <div className="flex items-center space-x-2">
              <Field
                type="email"
                name="email"
                className="w-full grow rounded-md bg-gray-100 px-5 py-3 outline-none"
                placeholder="Enter your email"
                autoComplete="off"
              />
              <button
                className="rounded-md bg-gray-800 px-5 py-3 font-bold text-gray-100 transition-all hover:scale-105 hover:bg-blue-500 disabled:opacity-80"
                type="submit"
                disabled={buttonDisabled}>
                {submitting ? 'Submitting' : 'Submit'}
              </button>
            </div>
            {message && (
              <p className={`${status !== 201 ? 'text-red-500' : 'text-green-500'} pt-4 font-black `}>
                {message}
              </p>
            )}
          </Form>
        </Formik>
      </div>
    </>
  )
}
