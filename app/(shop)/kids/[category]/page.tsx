"use client";

import { redirect } from "next/navigation";

export default function KidsCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  // Redirect to shop with kids section filter
  redirect("/shop?section=kids");
}
