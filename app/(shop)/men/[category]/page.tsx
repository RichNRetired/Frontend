"use client";

import { redirect } from "next/navigation";

export default function MenCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  // Redirect to shop with mens section filter
  redirect("/shop?section=mens");
}
