'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { Form, FormControl } from "../ui/form"
import { createUser } from "@/lib/actions/patient.actions"
import CustomFormField from "../CustomFormField"
import { UserFormValidation } from "@/lib/Validation"
import SubmitButton from "../SubmitButton"
import { FormFieldType } from "./PatientsForm"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { GenderOption } from "@/constants"
import { Label } from "@radix-ui/react-label"




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
          <h1 className="header text-white-/70">Welcome👋</h1>
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
          label="Full Name"
          placeholder="Enter your username"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email address"
            placeholder="healthcare5005@example.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of Birth"

          />
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                  {GenderOption.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}
                        className="cursor-pointer">
                        {option}

                      </Label>

                    </div>
                  ))}

                </RadioGroup>

              </FormControl>

            )}
          />

        </div>

        <div className="flex flex-col gap-6 xl:flex-row">

        </div>

        <div className="flex flex-col gap-6 xl:flex-row">

        </div>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm
