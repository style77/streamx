import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome to StreamX</h1>
        <p className="text-gray-500 text-lg">StreamX is a platform for streaming and watching live streams.</p>
      </div>
    </section>
  )
}
