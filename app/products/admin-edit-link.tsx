import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

type Props = {
  productId: number;
};

export default async function AdminEditLink({ productId }: Props) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  if (!isAdmin) return null;

  return (
    <div className="mt-3">
      <Link
        href={`/admin/products/${productId}/edit`}
        className="text-sm text-blue-600 hover:underline"
      >
        Edit
      </Link>
    </div>
  );
}