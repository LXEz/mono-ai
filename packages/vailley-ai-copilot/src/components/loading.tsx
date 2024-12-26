"use client";

import { createContext, useContext, useState } from "react";

const LoadingContext = createContext({
  loading: false,
  setLoading: (loading: boolean) => {},
});

interface Props {
  init: boolean;
  children: React.ReactNode;
}

export const LoadingProvider = ({ init = false, children }: Props) => {
  const [loading, setLoading] = useState(init);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

export const Loading = () => {
  const { loading } = useLoading();

  return (
    loading && (
      <div className="fixed inset-0 flex items-center justify-center z-20 bg-black/40">
        <div className="animate-spin rounded-full border-4 border-white border-t-transparent h-12 w-12" />
      </div>
    )
  );
};
