"use client";

import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";

export default function ScoreGuidePage() {
  const router = useRouter();
  const params = useParams<{ articleId: string }>();
  const articleId = params.articleId;

  return <div></div>;
}
