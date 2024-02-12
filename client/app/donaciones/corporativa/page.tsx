"use client";
import Image from "next/image";
import React, { useState, FormEvent, ChangeEvent } from "react";
import Donaciones from "../../../public/assets/donaciones-icon.svg";
import axios from "axios";
import ProjectsSelect from "@/components/Donaciones/ListaProyectos/SelectProyectos";
import { useAuthContext } from "@/app/contexto/AuthContext";

interface FormData {
  programId: number;
  amount: number | null;
  type: string;
  message: string;
  userId: number | null;
  date: string;
  frequency: string | null;
  contact_phone: string;
  contact_email: string;
}

const DonacionesCorporativasPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    programId: 0,
    amount: null,
    type: "Corporativo",
    message: "",
    userId: 0,
    date: new Date().toISOString(),
    frequency: null,
    contact_phone: "",
    contact_email: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const { logged, infoUserGlobal } = useAuthContext();
  const infoUserParsed = JSON.parse(infoUserGlobal ?? '')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    try {
      const infoDonacion = {
        programId: formData.programId,
        amount: formData.amount,
        type: formData.type,
        message: formData.message,
        userId: logged ? infoUserParsed.id : null,
        date: formData.date,
        frequency: formData.frequency,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
      }
      const response = await axios.post<{ mensaje: string }>(
        "https://juntxs.vercel.app/donations",
        infoDonacion
      );
      console.log("Respuesta del servidor:", response.data);
      setFormData({
        programId: 0,
        amount: null,
        type: "Corporativo",
        message: "",
        userId: 0,
        date: new Date().toISOString(),
        frequency: null,
        contact_phone: "",
        contact_email: "",
      })

      setSuccessMessage("¡Gracias por tu mensaje! Nos estaremos contactando contigo muy pronto.");
    } catch (error: any) {
      console.error("Error al enviar datos al servidor:", error.message);
    }
  };

  const handleProjectChange = (projectId: number) => {
    setFormData({
      ...formData,
      programId: projectId,
    });
  };

  return (
    <div className="w-screen h-[80vh]  flex justify-center items-center">
      <div className="w-11/12 h-5/6 border border-blue-400 rounded-2xl shadow-2xl flex justify-center">
        <div className="w-full h-full flex justify-center">
          <form
            action=""
            className="w-full h-full  flex"
            onSubmit={handleSubmit}
          >
            <div className=" w-4/6 h-full  flex flex-col justify-center">
              <div className="w-full flex justify-center ">
                <div className=" w-2/3  flex flex-col justify-center">
                  <div className="w-full flex flex-col justify-center gap-7">
                    <div className="text-3xl">Donaciones Corporativas</div>

                    <div className="flex flex-col">
                      <div className="flex flex-col gap-2">
                        <label className="m-0">Proyecto:</label>
                        <ProjectsSelect onProjectChange={handleProjectChange} />
                        <button className="text-xs flex justify-end ">
                          {" "}
                          Ver proyecto{" "}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="">Contacto: </label>
                      <input
                        type="text"
                        placeholder="Numero de telefono"
                        name="contact_phone"
                        onChange={handleChange}
                        value={formData.contact_phone}
                        className="w-full p-2 border border-gray-300 rounded resize-none"
                      />
                      <input
                        type="text"
                        placeholder="Email"
                        name="contact_email"
                        onChange={handleChange}
                        value={formData.contact_email}
                        className="w-full p-2 border border-gray-300 rounded mt-4 resize-none"
                      />
                    </div>

                    <div className=" ">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded resize-none"
                        placeholder="Deja tu mensaje"
                      />
                    </div>

                    <div>
                      <button type="submit" className="bg-[#7286FF] hover:bg-[#92A1FF] text-white py-2 px-4 rounded">
                        Describe tu donación
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {successMessage && <div>{successMessage}</div>}
            </div>

            <div className=" w-2/6 h-full overflow-hidden flex justify-center items-center">
              <div className="flex justify-center items-center">
                <div className="flex justify-center items-center object-contain h-full w-full">
                  <Image
                    src={Donaciones}
                    alt=""
                    className="h-full"
                    objectFit="contain"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonacionesCorporativasPage;
