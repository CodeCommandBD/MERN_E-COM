"use client";
import { Card, CardContent } from "@/components/ui/card";
import { logo_black } from "@/public/image";
import Image from "next/image";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { zSchema } from "@/lib/zodSchema";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/Application/ButtonLoading";
import { z } from "zod";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/Routes/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);
  const [isTypeConfirmPassword, setIsTypeConfirmPassword] = useState(true);
  const router = useRouter();

  // TODO:##### Form valid
  // TODO:##### Form valid
  const formSchema = zSchema
    .pick({
      name: true,
      email: true,
      password: true,
    })
    .extend({
      confirmPassword: z.string({
        required_error: "Confirm Password is required",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"], // error will show under confirmPassword
      message: "Passwords do not match",
    });

  // TODO: ########## Form Define
  // TODO: ########## Form Define
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  // TODO: ###### formHandle Submit
  // TODO: ###### formHandle Submit

  const handleRegisterSubmit = async (value) => {
    try {
      setLoading(true);
      const { data: registerResponse } = await axios.post(
        "/api/auth/register",
        value
      );
      if (!registerResponse.success) {
        throw new Error(registerResponse.message);
      }
      form.reset();
      showToast("success", registerResponse.message);
      router.push(WEBSITE_LOGIN);
    } catch (error) {
      // Get error message from API response or fallback to error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardContent>
        <div className="flex justify-center mb-3">
          <Image
            src={logo_black}
            width={logo_black.width}
            height={logo_black.height}
            alt="logo"
            className="max-w-[150px]"
          ></Image>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Account!</h1>
          <p>Create new account by filling out the form below</p>
        </div>
        <div className="mt-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleRegisterSubmit)}
              className="space-y-8"
            >
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your fullname"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Example@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={isTypePassword ? "password" : "text"}
                            placeholder="**************"
                            className="pr-10"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                          onClick={() => setIsTypePassword(!isTypePassword)}
                        >
                          {isTypePassword ? (
                            <FaRegEyeSlash></FaRegEyeSlash>
                          ) : (
                            <FaRegEye></FaRegEye>
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={isTypeConfirmPassword ? "password" : "text"}
                            placeholder="**************"
                            className="pr-10"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                          onClick={() =>
                            setIsTypeConfirmPassword(!isTypeConfirmPassword)
                          }
                        >
                          {isTypeConfirmPassword ? (
                            <FaRegEyeSlash></FaRegEyeSlash>
                          ) : (
                            <FaRegEye></FaRegEye>
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <ButtonLoading
                  loading={loading}
                  type={"submit"}
                  text={"Create Account"}
                  className={"w-full cursor-pointer duration-300"}
                ></ButtonLoading>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5">
                  <p>Already have account?</p>
                  <Link
                    href={WEBSITE_LOGIN}
                    className="text-primary hover:underline"
                  >
                    Login!
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;
