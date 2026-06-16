import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { saveAuthSession } from "../lib/auth";
import { getApiErrorMessage } from "../lib/apiError";
import { useLoginMutation } from "../redux/api/authApi";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values).unwrap();
      saveAuthSession(response.token, response.expiresAt);
      toast.success("Signed in");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <div className="mb-3 grid size-11 place-items-center rounded-lg bg-teal-600 text-white">
            <LogIn size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-950">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Use your Employee API credentials.</p>
        </div>

        <div className="space-y-4">
          <Input label="Username" autoComplete="username" error={errors.username?.message} {...register("username")} />
          <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register("password")} />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          <LogIn size={17} /> {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </main>
  );
}
