"use client";

import { redirect } from "next/navigation";

export default function GirlsPage() {
  redirect("/shop?section=girls");
}
