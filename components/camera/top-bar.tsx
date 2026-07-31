"use client"

import { useEffect, useRef, useState } from "react"
import { Menu, ChevronDown, ArrowRight, Check } from "lucide-react"
import type { LanguagePair } from "@/lib/vocab"
import { LANGUAGE_PAIRS } from "@/lib/vocab"

type TopBarProps = {
  onOpenMenu: () => void
  languagePair: LanguagePair
  onChangeLanguage: (pair: LanguagePair) => void
}

export function TopBar({ onOpenMenu, languagePair, onChangeLanguage }: TopBarProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  return (
    <header className="relative z-20 flex items-center justify-between px-4 pt-6 pb-2">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Mở menu"
        className="flex size-11 items-center justify-center rounded-full bg-neutral-800/70 text-neutral-100 backdrop-blur transition-colors hover:bg-neutral-700 active:scale-95"
      >
        <Menu className="size-5" />
      </button>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-2 rounded-full bg-neutral-800/70 px-4 py-2.5 text-sm font-medium text-neutral-100 backdrop-blur transition-colors hover:bg-neutral-700 active:scale-95"
        >
          <span>{languagePair.fromShort}</span>
          <ArrowRight className="size-3.5 text-amber-400" />
          <span>{languagePair.toShort}</span>
          <ChevronDown className={`size-4 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute right-0 top-full z-30 mt-2 w-56 origin-top-right animate-in fade-in zoom-in-95 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-1.5 shadow-2xl shadow-black/50 duration-150"
          >
            {LANGUAGE_PAIRS.map((pair) => {
              const active = pair.id === languagePair.id
              return (
                <button
                  key={pair.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChangeLanguage(pair)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    active ? "bg-amber-500/15 text-amber-300" : "text-neutral-200 hover:bg-neutral-800"
                  }`}
                >
                  <span>
                    {pair.from} <span className="text-neutral-500">→</span> {pair.to}
                  </span>
                  {active && <Check className="size-4 shrink-0" />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </header>
  )
}
