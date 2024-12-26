import LoadingIcon from "@/assets/loading.svg";

export default function Loading() {
  return (
    <div className="flex items-center">
      <LoadingIcon className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
      Sending...
    </div>
  );
}
