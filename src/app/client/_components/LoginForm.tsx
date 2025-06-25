/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { getSession, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { RegisterClient } from "@/actions/client";

// Define both schemas
const loginSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const registerSchema = z.object({
  nom: z.string().min(2, {
    message: "nom must be at least 2 characters.",
  }),
  prenom: z.string().min(2, {
    message: "prenom must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z
    .string()
    .min(10, {
      // Changed from number to string
      message: "Phone number must be at least 10 characters.",
    })
    .regex(/^[0-9]+$/, {
      message: "Please enter a valid phone number",
    }),
  passwordr: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const AuthForm = () => {
  const [loginView, setLoginView] = useState(false);
  const [registerView, setRegisterView] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();

  const formLogin = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const formRegister = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      phone: undefined,
      email: "",
      passwordr: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    if (isLogin) {
      // Login logic
      const res = await signIn("username-only", {
        username: values.username.toLowerCase(),
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
        setLoading(false);
      } else {
        await update();
        setLoading(false);
        redirect("/client/dashboard");
      }
    }
  }
  async function onSubmitRegister(values: z.infer<typeof registerSchema>) {
    setLoading(true);

    if (!isLogin) {
      // Register logic
      try {
        if (values.passwordr === values.confirmPassword) {
          const response = await RegisterClient(
            values.nom,
            values.prenom,
            values.email,
            values.phone,
            values.passwordr
          );
          if (response.success) {
            toast.success("Registration successful! Please login.");
            setIsLogin(true);
            formRegister.reset();
          }
        }
      } catch (error) {
        toast.error("Registration failed");
      } finally {
        setLoading(false);
      }
    }
  }
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    formLogin.reset();
    formRegister.reset();
    setLoginView(false);
    setRegisterView(false);
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="lg:min-w-xl min-w-xs">
      <div className="">
        <div className="pb-4">
          <div className="mb-4 w-full flex items-center justify-center">
            <Link href="/" className="lg:flex">
              <img src="/horizontal.png" alt="" className="w-56 h-auto" />
            </Link>
          </div>

          {/* Auth Mode Toggle */}
          <div className="grid grid-cols-2 gap-1 w-full">
            <Button
              onClick={toggleAuthMode}
              className={`w-full rounded-l-full py-3 cursor-pointer ${
                isLogin
                  ? "bg-[#8EBD22] hover:bg-green-800 text-white"
                  : "bg-white border text-green-800 hover:bg-green-100 hover:text-green-700"
              }`}
            >
              S&apos;identifier
            </Button>
            <Button
              onClick={toggleAuthMode}
              className={`w-full rounded-r-full py-3 cursor-pointer ${
                !isLogin
                  ? "bg-[#8EBD22] text-white hover:bg-green-800"
                  : "bg-white border text-green-800 hover:bg-green-100 hover:text-green-800"
              }`}
            >
              Inscription
            </Button>
          </div>

          <div className="w-full flex items-center justify-center mt-4">
            <div className="border-b-[1px] border border-gray-100 w-full"></div>
            <div className="text-xs text-gray-100 text-center w-full">
              {isLogin ? "Espace Client" : "Créer un compte"}
            </div>
            <div className="border-b-[1px] border border-gray-100 w-full"></div>
          </div>
        </div>
        {isLogin ? (
          <Form {...formLogin}>
            <form
              onSubmit={formLogin.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <FormField
                control={formLogin.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="dark:bg-slate-900 text-white placeholder-slate-300"
                        placeholder="Entrez votre identifiant"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formLogin.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="dark:bg-slate-900 text-white placeholder-slate-300"
                          type={loginView ? "text" : "password"}
                          placeholder={`Entrez votre mot de passe${
                            !isLogin ? " (min 6 caractères)" : ""
                          }`}
                          {...field}
                        />
                        {loginView ? (
                          <Eye
                            className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-100"
                            onClick={() => setLoginView(!loginView)}
                          />
                        ) : (
                          <EyeOff
                            className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-100"
                            onClick={() => setLoginView(!loginView)}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex items-center justify-start">
                <Button
                  type="submit"
                  className="w-full rounded-full py-3 bg-[#8EBD22] border-2 text-white hover:bg-green-700 cursor-pointer"
                >
                  {isLogin ? "Se connecter" : "S'inscrire"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...formRegister}>
            <form
              onSubmit={formRegister.handleSubmit(onSubmitRegister)}
              className="space-y-4 w-full "
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={formRegister.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input
                          className="dark:bg-slate-900 text-white w-full placeholder-slate-300"
                          placeholder="Entrez votre identifiant"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prenom</FormLabel>
                      <FormControl>
                        <Input
                          className="dark:bg-slate-900 text-white w-full placeholder-slate-300"
                          placeholder="Entrez votre identifiant"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formRegister.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="dark:bg-slate-900 text-white placeholder-slate-300"
                          placeholder="Entrez votre identifiant"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="dark:bg-slate-900 text-white placeholder-slate-300"
                          placeholder="Entrez votre identifiant"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="passwordr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="dark:bg-slate-900 text-white placeholder-slate-300"
                            type={registerView ? "text" : "password"}
                            placeholder={`Entrez votre mot de passe`}
                            {...field}
                          />
                          {registerView ? (
                            <Eye
                              className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-100"
                              onClick={() => setRegisterView(!registerView)}
                            />
                          ) : (
                            <EyeOff
                              className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-100"
                              onClick={() => setRegisterView(!registerView)}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formRegister.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmez votre Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="dark:bg-slate-900 text-white placeholder-slate-300"
                            type={registerView ? "text" : "password"}
                            placeholder={`Confirmez votre mot de passe`}
                            {...field}
                          />
                          {registerView ? (
                            <Eye
                              className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-100"
                              onClick={() => setRegisterView(!registerView)}
                            />
                          ) : (
                            <EyeOff
                              className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-100"
                              onClick={() => setRegisterView(!registerView)}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full flex items-center justify-start">
                <Button
                  type="submit"
                  className="w-full rounded-full py-3 bg-[#8EBD22] border-2 text-white hover:bg-green-700 cursor-pointer"
                >
                  {isLogin ? "Se connecter" : "S'inscrire"}
                </Button>
              </div>
            </form>
            {isLogin && (
              <div className="text-center text-sm text-gray-400">
                Pas de compte?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-green-500 hover:underline"
                >
                  Créer un compte
                </button>
              </div>
            )}
          </Form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
