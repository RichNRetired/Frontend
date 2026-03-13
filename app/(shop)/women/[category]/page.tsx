"use client";

import { redirect } from "next/navigation";

export default function WomenCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  // Redirect to shop with womens section filter
  redirect("/shop?section=womens");
}
