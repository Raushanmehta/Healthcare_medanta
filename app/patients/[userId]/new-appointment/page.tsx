import AppointmentForm from "@/components/forms/AppointmentForm";
import Image from "next/image";

const  NewAppointment= ()=> {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between ">
          <Image
            src="/assets/icons/medanta-logo.png"
            alt="patient"
            width={1000}
            height={1000} 
            className="mb-12 h-10 w-fit"
          />
          <AppointmentForm/>
            <p className=" justify-items-end text-dark-600 xl:text-left ">
          © 2024 Medanta
            </p>
            </div>
      </section>
      <Image
            src="/assets/images/appointment-img.png"
            alt="appointment"
            width={1000}
            height={1000} 
            className="side-img max-w-[390px] bg-bottom"
          />
    </div>
  );
}
export default NewAppointment