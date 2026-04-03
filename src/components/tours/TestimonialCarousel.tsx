"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Testimonial {
  name: string
  avatar: string
  /** The review body — maps to Wix CMS "Text" field */
  quote: string
  date?: string
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  title?: string
  className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TestimonialCarousel({
  testimonials,
  title = "Guest Reviews",
  className = "",
}: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0)

  if (testimonials.length === 0) return null

  const next = () => setIndex((i) => (i + 1) % testimonials.length)
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)

  const current = testimonials[index]

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mt-12 mb-12 ${className}`}
    >
      <h2 className="mb-6 font-sans text-2xl font-bold text-ocean-deep">{title}</h2>

      <div className="relative overflow-hidden rounded-2xl border border-tan/30 bg-white p-6 shadow-sm sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="min-h-35"
          >
            {/* Reviewer header */}
            <div className="mb-4 flex items-center gap-3">
              <div className="avatar">
                <div className="w-12 rounded-full">
                  {current.avatar ? (
                    <Image
                      src={current.avatar}
                      alt={current.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                      unoptimized={current.avatar.startsWith("data:")}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-ocean/10" />
                  )}
                </div>
              </div>

              <div>
                <p className="font-semibold text-ocean-deep">{current.name}</p>
                {current.date && (
                  <p className="text-xs text-ocean-deep/50">
                    {current.date}
                  </p>
                )}
              </div>
            </div>

            {/* Review text */}
            <p className="text-sm italic leading-relaxed text-ocean-deep/75">
              &ldquo;{current.quote}&rdquo;
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators + nav buttons */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show review ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-ocean" : "w-2 bg-tan/40 hover:bg-tan/60"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Previous review"
              className="btn btn-circle btn-ghost btn-sm border border-tan/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next review"
              className="btn btn-circle btn-ghost btn-sm border border-tan/30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
