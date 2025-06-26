/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { CreateReservations } from "@/actions/reservationsActions";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});
import success from "../../../../public/success.json";
export default function ReservationsForm({
  fields,
  tourId,
  travelDates = [],
  basePrice,
}: any) {
  const [formData, setFormData] = useState<any>({
    nom: "",
    prenom: "",
    phone: "",
    email: "",
    travelDateId: travelDates[0]?.id || "",
    customFields: {},
  });
  const [finalPrice, setFinalPrice] = useState<any>(basePrice); // Initialize with basePrice
  const [isSubmitted, setIsSubmitted] = useState(false); // Add this state

  // Add this useEffect hook
  useEffect(() => {
    const newPrice = calculateFinalPrice();
    setFinalPrice(newPrice);
  }, [formData, basePrice, fields]); // Recalculate when these dependencies change

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (["nom", "prenom", "phone", "email", "travelDateId"].includes(name)) {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        customFields: { ...prev.customFields, [name]: value },
      }));
    }
    // Removed the manual finalPrice calculation from here
  };

  const calculateFinalPrice = () => {
    let total = basePrice;
    for (const field of fields) {
      if (field.type === "checkbox" && formData.customFields[field.name]) {
        total += Number(field.price || 0);
      }
      if (field.type === "select") {
        const selectedOption = field.options.find(
          (opt: any) => opt.value === formData.customFields[field.name]
        );
        if (selectedOption) {
          total += Number(selectedOption?.price || 0);
        }
      }
    }
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await CreateReservations({
        tourId,
        travelDateId: formData.travelDateId,
        nom: formData.nom,
        prenom: formData.prenom,
        phone: formData.phone,
        email: formData.email,
        data: formData.customFields,
        basePrice: finalPrice, // assuming this is your base price
      });

      toast.success("✅ Reservation sent!");
      setFormData({
        nom: "",
        prenom: "",
        phone: "",
        email: "",
        travelDateId: travelDates[0]?.id || "",
        customFields: {},
      });
      setFinalPrice(basePrice);
      setIsSubmitted(true);

      // Hide success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 4000);
    } catch (error) {
      console.error("❌ Failed to submit reservation:", error);
      toast.error("Erreur lors de l'envoi de la réservation.");
    }
  };

  function formatDate(date: Date): string {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 md:gap-12 items-start">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-100">
          {/* Form Header */}
          <div
            className="mb-6 pb-4 border-b border-gray-200"
            style={{
              backgroundColor: "#8ebd21",
              color: "white",
              padding: "1rem",
              borderRadius: "8px 8px 0 0",
              marginTop: "-1.5rem",
              marginLeft: "-2rem",
              marginRight: "-2rem",
            }}
          >
            <h2 className="text-2xl font-bold text-center">RÉSERVATION</h2>
            <div className="flex justify-center mt-1">
              <span className="w-3 h-1 bg-yellow-400 rounded-full mr-1"></span>
              <span className="w-8 h-1 bg-yellow-500 rounded-full"></span>
            </div>
          </div>
          {isSubmitted ? (
            <div className="w-full justify-center lg:flex hidden">
              <div
                className=" text-green-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <LottiePlayer
                  loop={false}
                  animationData={success}
                  play
                  className="w-full"
                />
                <strong className="font-bold">Succès!</strong>
                <span className="block sm:inline">
                  {" "}
                  Votre réservation a été envoyée avec succès.
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Default fields */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="text-black">
                    Nom <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="nom"
                    placeholder="ex.Jhon"
                    onChange={handleChange}
                    className="rounded-md border border-gray-300 text-sm p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="text-black">
                    Prenom <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="prenom"
                    placeholder="Prénom"
                    onChange={handleChange}
                    className="rounded-md border border-gray-300 text-sm p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="text-black">
                    Téléphone <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="phone"
                    placeholder="Téléphone"
                    onChange={handleChange}
                    className="rounded-md border border-gray-300 text-sm p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="text-black">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="email"
                    placeholder="Email"
                    className="rounded-md border border-gray-300 text-sm p-2"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Travel date */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="text-black">
                    Date Disponible <span className="text-red-600">*</span>
                  </label>
                  {travelDates.length > 0 && (
                    <select
                      name="travelDateId"
                      onChange={handleChange}
                      className="rounded-md border border-gray-300 text-sm p-2"
                    >
                      {travelDates.map((d: any) => (
                        <option value={d.id} key={d.id}>
                          {formatDate(d.startDate)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Dynamic custom fields */}
                {fields.map((field: any, index: number) => {
                  if (field.type === "text") {
                    return (
                      <div className="flex flex-col gap-2" key={index}>
                        <label htmlFor="" className="text-black">
                          {field.label} {field.required &&  <span className="text-red-600">*</span>}
                        </label>
                        <input
                          name={field.name}
                          placeholder={field.label}
                          onChange={handleChange}
                          className="rounded-md border border-gray-300 text-sm p-2"
                          required={field.required}
                        />
                      </div>
                    );
                  }
                  if (field.type === "checkbox") {
                    return (
                      <div
                        className="flex items-center ps-4 border border-gray-200 rounded-sm dark:border-gray-700"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          name={field.name}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: field.name,
                                value: e.target.checked,
                              },
                            })
                          }
                          id="bordered-checkbox-1"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="bordered-checkbox-1"
                          className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          {field.label} (+{field.price || 0} MAD) {field.required &&  <span className="text-red-600">*</span>}
                        </label>
                      </div>
                    );
                  }
                  if (field.type === "select") {
                    return (
                      <div className="flex flex-col gap-2" key={index}>
                        <label htmlFor="" className="text-black">
                          {field.label} {field.required &&  <span className="text-red-600">*</span>}
                        </label>
                        <select
                          name={field.name}
                          onChange={handleChange}
                          className="rounded-md border border-gray-300 text-sm p-2"
                        >
                          <option value="">-- {field.label} --</option>
                          {field.options.map((opt: any, i: number) => (
                            <option key={i} value={opt.value}>
                              {opt.label}{" "}
                              {opt.price > 0 && <span>+{opt.price} MAD</span>}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Résumé de la réservation */}
              {/* Résumé de la réservation */}
              <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  🧾 Résumé de la réservation
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Prix de base</span>
                    <span>{basePrice} MAD</span>
                  </div>
                  {fields
                    .filter((field: any) => {
                      if (field.type === "checkbox") {
                        return formData.customFields[field.name];
                      }
                      if (field.type === "select") {
                        return formData.customFields[field.name];
                      }
                      return false;
                    })
                    .map((field: any, index: number) => {
                      if (field.type === "checkbox") {
                        return (
                          <div className="flex justify-between" key={index}>
                            <span>{field.label}</span>
                            <span>+{field.price || 0} MAD</span>
                          </div>
                        );
                      }
                      if (field.type === "select") {
                        // Only display if at least one option has a price
                        const hasPricedOptions = field.options?.some(
                          (opt: any) =>
                            typeof opt.price === "number" && opt.price > 0
                        );

                        if (!hasPricedOptions) return null;

                        const selected = field.options.find(
                          (opt: any) =>
                            opt.value === formData.customFields[field.name]
                        );

                        return selected ? (
                          <div className="flex justify-between" key={index}>
                            <span>
                              {field.label}: {selected.label}
                            </span>
                            <span>+{selected.price || 0} MAD</span>
                          </div>
                        ) : null;
                      }

                      return null;
                    })}
                </div>
                <hr className="my-4" />
                <div className="flex justify-between font-bold text-base text-gray-800">
                  <span>Total</span>
                  <span>{finalPrice} MAD</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-lg font-semibold rounded-md py-2"
                style={{ backgroundColor: "#8ebd21", color: "white" }}
              >
                Réserver
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
