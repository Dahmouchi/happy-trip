
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "../_components/LoginForm";

export default async function AuthButton() {
const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/admin/dashboard");
  }
  return (
    <div
      className="flex h-screen w-full items-center relative justify-center bg-gray-900 bg-cover bg-no-repeat"
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/547119/pexels-photo-547119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
      }}
    >
      <div className="w-full h-full bg-black/20 absolute top-0"></div>
      <div className="rounded-xl bg-gray-300/20 border-2 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-xs max-sm:px-8">
        <div className="text-white">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
