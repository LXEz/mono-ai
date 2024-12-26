"use client";
import { Loading, LoadingProvider } from "@/components/loading";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ConsoleLayout({ children }: Props) {
  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden">
      <LoadingProvider init={false}>
        <div>{children}</div>
        <Loading />
      </LoadingProvider>
    </div>
  );
}
