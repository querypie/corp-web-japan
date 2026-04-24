import { permanentRedirect } from "next/navigation";
import { CONTACT_REDIRECT_TARGET } from "@/lib/contact";

export default function ContactUsPage() {
  permanentRedirect(CONTACT_REDIRECT_TARGET);
}
