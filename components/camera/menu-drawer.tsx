"use client"

import { BookMarked, Layers, ChevronRight } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

type MenuDrawerProps = {
  open: boolean
  onClose: () => void
}

const LINKS = [
  { label: "Từ vựng đã lưu", description: "Bộ sưu tập từ của bạn", icon: BookMarked, href: "/saved" },
  { label: "Flashcard", description: "Ôn tập theo thẻ ghi nhớ", icon: Layers, href: "/flashcards" },
]

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <SheetContent side="left" className="w-[82%] max-w-xs border-r border-neutral-800 bg-neutral-900 p-0 text-neutral-50 sm:max-w-xs">
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-neutral-800/50 text-left">
          <SheetTitle className="text-lg font-semibold text-neutral-50">LingoLens</SheetTitle>
          <SheetDescription className="text-sm text-neutral-400">Học từ vựng qua ống kính</SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-2 px-3 pt-4">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group flex items-center gap-3 rounded-2xl bg-neutral-800/50 px-3 py-3.5 transition-colors hover:bg-neutral-800"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                <link.icon className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-neutral-50">{link.label}</span>
                <span className="block text-xs text-neutral-400">{link.description}</span>
              </span>
              <ChevronRight className="size-4 text-neutral-500 transition-transform group-hover:translate-x-0.5" />
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

