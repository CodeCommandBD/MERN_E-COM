"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { verification_fail, verified_gif } from "@/public/image";
import { WEBSITE_HOME, WEBSITE_LOGIN } from "@/Routes/WebsiteRoute";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/reducer/authReducer";

const EmailVerification = ({ params }) => {
  const { token } = use(params);
  const [isVerified, setIsVerified] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      try {
        const { data: verificationResponse } = await axios.post(
          "/api/auth/verify-email",
          { token }
        );
        setIsVerified(!!verificationResponse?.success);
      } catch (err) {
        setIsVerified(false);
      }
    };
    if (token) verify();
  }, [token]);

  // Auto redirect to login after successful verification
  const dispatch = useDispatch();

  useEffect(() => {
    if (isVerified === true) {
      const interval = setInterval(async () => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Logout user before redirecting to login page
            const performLogout = async () => {
              try {
                await axios.post("/api/auth/logout");
                dispatch(logout());
              } catch (error) {
                console.error(
                  "Logout failed during verification redirect",
                  error
                );
              } finally {
                router.push(WEBSITE_LOGIN);
              }
            };
            performLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isVerified, router, dispatch]);

  return (
    <Card className={"w-[400px] mx-auto"}>
      <CardContent>
        {isVerified === null ? (
          <div>
            <div className="text-center">
              <h2 className="text-lg font-medium my-5">
                Verifying your email...
              </h2>
            </div>
          </div>
        ) : isVerified ? (
          <div>
            <div className="flex items-center justify-center">
              <Image
                src={verified_gif.src}
                width={100}
                height={100}
                alt="verification success"
              ></Image>
            </div>
            <div className="text-center">
              <h2 className="text-2xl text-green-500 font-bold my-5">
                Email verification success!
              </h2>
              <p className="text-gray-600 mb-4">
                Redirecting to login in {countdown} seconds...
              </p>
              <Button asChild>
                <Link href={WEBSITE_LOGIN}>Login Now</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center">
              <Image
                src={verification_fail.src}
                width={100}
                height={100}
                alt="verification failed"
              ></Image>
            </div>
            <div className="text-center">
              <h2 className="text-2xl text-red-500 font-bold my-5">
                Email verification Failed!
              </h2>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
