'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { Form } from "../ui/form"
import { createUser } from "@/lib/actions/patient.actions"
import CustomFormField from "../CustomFormField"
import { UserFormValidation } from "@/lib/Validation"
import SubmitButton from "../SubmitButton"
import { FormFieldType } from "./PatientsForm"




const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);

    try {
      const userData = { name, email, phone };
      const user = await createUser(userData);
      if (user) router.push(`/patient/${user.$id}/register`)

    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
      className="space-y-12 flex-1">
        <section className=" space-y-4">
          <h1 className="header">Welcome👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className=" space-y-6">
          <div className="mb-9 space-y-1">

          </div>
          <h2 className="sub-header">Personal Information.</h2>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="username"
          label="Full name"
          placeholder="Enter your username"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm
