"use client";

import { redirect } from "next/navigation";

export default function MenPage() {
  // Redirect to shop with mens section filter
  redirect("/shop?section=mens");
}

