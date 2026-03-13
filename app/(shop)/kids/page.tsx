"use client";

import { redirect } from "next/navigation";

export default function KidsPage() {
  // Redirect to shop with kids section filter
  redirect("/shop?section=kids");
}
