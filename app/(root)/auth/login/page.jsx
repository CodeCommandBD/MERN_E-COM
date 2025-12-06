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
import {
  WEBSITE_HOME,
  WEBSITE_REGISTER,
  WEBSITE_RESETPASSWORD,
} from "@/Routes/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/Application/OTPverification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/Routes/AdminPanelRoute";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);
  const [otpEmail, setOtpEmail] = useState();
  const [showOTP, setShowOTP] = useState(false);

  const dispatch = useDispatch();

  // TODO:##### Form valid
  // TODO:##### Form valid
  const formSchema = zSchema
    .pick({
      email: true,
    })
    .extend({
      password: z
        .string()
        .min(3, "Password is required & must be at least 3 characters!"),
    });

  // TODO: ########## Form Define
  // TODO: ########## Form Define
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // TODO: ###### formHandle Submit
  // TODO: ###### formHandle Submit

  const handleLoginSubmit = async (value) => {
    try {
      setLoading(true);
      const { data: registerResponse } = await axios.post(
        "/api/auth/login",
        value
      );
      if (!registerResponse.success) {
        throw new Error(registerResponse.message);
      }

      // If login successful and OTP is required
      if (registerResponse.message === "Please verify your device") {
        setOtpEmail(value.email);
        setShowOTP(true);
        showToast("success", "OTP sent to your email");
      } else {
        // Login successful without OTP - dispatch user data
        if (registerResponse.data) {
          dispatch(login(registerResponse.data));
        }
        form.reset();
        showToast("success", registerResponse.message);
      }
    } catch (error) {
      // Extract error message from API response
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // TODO: ######## otp verification
  const handleOtpVerification = async (otpData) => {
    try {
      setOtpLoading(true);
      const { data: otpResponse } = await axios.post("/api/auth/verify-otp", {
        email: otpEmail,
        otp: otpData.otp,
      });

      if (otpResponse.success) {
        showToast("success", "Login successful!");
        dispatch(login(otpResponse.data));
        try {
          if (searchParams?.has("callback")) {
            router.push(searchParams.get("callback"));
          } else {
            otpResponse.data.role === "admin"
              ? router.push(ADMIN_DASHBOARD)
              : router.push(WEBSITE_HOME);
          }
        } catch (redirectError) {
          console.log("Redirect error:", redirectError);
          otpResponse.data.role === "admin"
            ? router.push(ADMIN_DASHBOARD)
            : router.push(WEBSITE_HOME);
        }
        setShowOTP(false);
        setOtpEmail(null);
        form.reset();
      } else {
        showToast("error", otpResponse.message);
      }
    } catch (error) {
      showToast("error", "OTP verification failed");
    } finally {
      setOtpLoading(false);
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
        {!showOTP ? (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Login Into Account</h1>
              <p>Login into your account by filling out the form below</p>
            </div>
            <div className="mt-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleLoginSubmit)}
                  className="space-y-8"
                >
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
                        <FormItem className={"relative"}>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type={isTypePassword ? "password" : "text"}
                              placeholder="**************"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 cursor-pointer"
                            onClick={() => setIsTypePassword(!isTypePassword)}
                          >
                            {isTypePassword ? (
                              <FaRegEyeSlash></FaRegEyeSlash>
                            ) : (
                              <FaRegEye></FaRegEye>
                            )}
                          </button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <ButtonLoading
                      loading={loading}
                      type={"submit"}
                      text={"Login"}
                      className={"w-full cursor-pointer duration-300"}
                    ></ButtonLoading>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1.5">
                      <p>Don't have account?</p>
                      <Link
                        href={WEBSITE_REGISTER}
                        className="text-primary hover:underline"
                      >
                        Create account!
                      </Link>
                    </div>
                    <div className="mt-3">
                      <Link
                        href={WEBSITE_RESETPASSWORD}
                        className="text-primary hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <OTPVerification
            email={otpEmail}
            loading={otpLoading}
            onSubmit={handleOtpVerification}
          ></OTPVerification>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginPage;
