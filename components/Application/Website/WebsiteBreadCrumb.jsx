import React from "react";
import { pageTitle } from "@/public/image";
import { WEBSITE_HOME } from "@/Routes/WebsiteRoute";
import Link from "next/link";
const WebsiteBreadCrumb = ({ props }) => {
  return (
    <div
      className="py-10 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${pageTitle.src})` }}
    >
      <div>
        <h1 className="text-2xl mb-2 text-center font-bold text-white">
          {props.title}
        </h1>
        <ul className="flex gap-2 justify-center">
          <li>
            {WEBSITE_HOME ? (
              <Link href={WEBSITE_HOME} className="">Home</Link>
            ) : (
              <span className="">Home</span>
            )}
          </li>
          {props.links.map((item, index) => (
            <li key={index}>
              <span className="text-primary me-1">/</span>
              {item.href ? (
                <Link href={item.href} className="font-semibold">{item.label}</Link>
              ) : (
                <span className="font-semibold">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebsiteBreadCrumb;
