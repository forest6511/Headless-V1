'use client'

import "./globals.css";
import {NextUIProvider} from "@nextui-org/react";
import React from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"test"}>
      <NextUIProvider>
        {children}
      </NextUIProvider>
      </body>
    </html>
  );
}
