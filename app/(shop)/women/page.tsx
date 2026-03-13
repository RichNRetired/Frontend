"use client";

import { redirect } from "next/navigation";

export default function WomenPage() {
  // Redirect to shop with womens section filter
  redirect("/shop?section=womens");
}
