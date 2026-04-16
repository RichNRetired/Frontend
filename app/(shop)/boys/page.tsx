"use client";

import { redirect } from "next/navigation";

export default function BoysPage() {
  redirect("/shop?section=boys");
}
