"use client"

import { useRef, useState } from "react"
import { TopBar } from "@/components/camera/top-bar"
import { CameraPreview } from "@/components/camera/camera-preview"
import { BottomBar } from "@/components/camera/bottom-bar"
import { MenuDrawer } from "@/components/camera/menu-drawer"
import { CaptureModal } from "@/components/camera/capture-modal"
import type { LanguagePair, Recognition } from "@/lib/vocab"
import { LANGUAGE_PAIRS, recognizeSample } from "@/lib/vocab"

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [languagePair, setLanguagePair] = useState<LanguagePair>(LANGUAGE_PAIRS[0])
  const [facingFront, setFacingFront] = useState(false)
  const [captured, setCaptured] = useState<{ image: string; recognition: Recognition } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleCapture() {
    setCaptured({ image: "/chair-preview.png", recognition: recognizeSample() })
  }

  function handleGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setCaptured({ image: url, recognition: recognizeSample() })
    e.target.value = ""
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-neutral-950 text-neutral-50">
      {/* subtle warm glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-24 -z-0 mx-auto h-72 w-72 rounded-full bg-amber-500/20 blur-3xl"
      />

      {/* 1. Top Bar */}
      <TopBar
        onOpenMenu={() => setDrawerOpen(true)}
        languagePair={languagePair}
        onChangeLanguage={setLanguagePair}
      />

      {/* 2. Camera Preview */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <CameraPreview facingFront={facingFront} />
        <p className="mt-6 text-balance text-center text-sm text-neutral-400">
          Chụp vật thể để dịch từ vựng
        </p>
      </section>

      {/* 3. Bottom Bar */}
      <BottomBar
        onCapture={handleCapture}
        onFlip={() => setFacingFront((v) => !v)}
        onPickGallery={() => fileInputRef.current?.click()}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleGallery}
      />

      {/* Menu Drawer (shadcn Sheet - slide left) */}
      <MenuDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Capture Modal (shadcn Dialog - capture result popup) */}
      <CaptureModal
        data={captured}
        languagePair={languagePair}
        onClose={() => setCaptured(null)}
        onRetake={() => {
          setCaptured(null)
          handleCapture()
        }}
      />
    </main>
  )
}

