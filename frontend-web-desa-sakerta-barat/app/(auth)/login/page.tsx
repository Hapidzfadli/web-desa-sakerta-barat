import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AuthForm from '../../../components/shared/AuthForm'

const Login = () => {
  return (
    <section className="size-full">
      <AuthForm type="login" />
    </section>
  )
}

export default Login