import type { Metadata } from "next";
import { SampleHomeSections } from "@/components/sections/sample-home-sections";
import { sampleHomeContent } from "@/content/sample-home";

export const metadata: Metadata = {
  title: `${sampleHomeContent.metadata.title} | QueryPie AI`,
  description: sampleHomeContent.metadata.description,
};

export default function SampleHomePage() {
  return <SampleHomeSections />;
}
