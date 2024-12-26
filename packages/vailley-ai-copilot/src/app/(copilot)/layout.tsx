"use client";
import { Loading, LoadingProvider } from "@/components/loading";
import { NotificationProvider } from "@/components/notification";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ConsoleLayout({ children }: Props) {
  return (
    //<div className="container mx-auto">
    //  <Heading className={clsx("py-3 text-2xl text-white")}>
    //    Sentiment Analysis on Social & CS
    //  </Heading>
    //  <LoadingProvider init={false}>
    //    <NotificationProvider>
    //      <div>{children}</div>
    //    </NotificationProvider>
    //    <Loading />
    //  </LoadingProvider>
    //</div>
    <div className="p-1">
      <LoadingProvider init={false}>
        <NotificationProvider>
          <div>{children}</div>
        </NotificationProvider>
        <Loading />
      </LoadingProvider>
    </div>
  );
}
