import PatientsForms from "@/components/forms/PatientsForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP Verivication passkeyModel */}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px] ">
          <Image
            src="/assets/icons/medanta-logo.png"
            alt="patient"
            width={1000}
            height={1000} 
            className="mb-12 h-10 w-fit"
          />
          <PatientsForms/>
          <div className="text-10-regular mt-10 flex justify-between ">
            <p className=" justify-items-end text-dark-600 xl:text-left ">
          © 2024 Medanta

            </p>
            <Link href={"/?admin=true"} className="text-green-500">Admin</Link>
          </div >
        </div>
      </section>
      <Image
            src="/assets/images/onboarding-img.png"
            alt="patient"
            width={1000}
            height={1000} 
            className="side-img max-w-[50%]"
          />
    </div>
  );
}
