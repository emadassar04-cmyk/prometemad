import { AuthForm } from "@/components/auth-form";
import { getTotalGenerationCount } from "@/lib/data/showcase";

export default async function SignInPage() {
  const totalGenerations = await getTotalGenerationCount();

  return (
    <div className="flex justify-center px-4 py-16">
      <AuthForm totalGenerations={totalGenerations} />
    </div>
  );
}
