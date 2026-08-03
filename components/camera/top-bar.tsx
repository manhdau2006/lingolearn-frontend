"use client"

import { useState } from "react"
import { Menu, ArrowRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { LanguagePair } from "@/lib/vocab"

type TopBarProps = {
  onOpenMenu: () => void
  languagePair?: LanguagePair
  onChangeLanguage?: (pair: LanguagePair) => void
}

const LANGUAGES = [
  "Tiếng Việt",
  "Tiếng Anh",
  "Tiếng Nhật",
  "Tiếng Hàn",
  "Tiếng Trung",
  "Tiếng Pháp",
]

export function TopBar({ onOpenMenu, languagePair, onChangeLanguage }: TopBarProps) {
  // State quản lý ngôn ngữ gốc (Mặc định: Tiếng Việt) và ngôn ngữ đích (Mặc định: Tiếng Anh)
  const [sourceLang, setSourceLang] = useState<string>(
    languagePair?.from || "Tiếng Việt"
  )
  const [targetLang, setTargetLang] = useState<string>(
    languagePair?.to || "Tiếng Anh"
  )

  const handleSourceChange = (val: unknown) => {
    if (typeof val !== "string") return
    setSourceLang(val)
    if (onChangeLanguage) {
      onChangeLanguage({
        id: `${val}-${targetLang}`,
        from: val,
        to: targetLang,
        fromShort: val.slice(0, 2).toUpperCase(),
        toShort: targetLang.slice(0, 2).toUpperCase(),
        speechLocale: "en-US",
      })
    }
  }

  const handleTargetChange = (val: unknown) => {
    if (typeof val !== "string") return
    setTargetLang(val)
    if (onChangeLanguage) {
      onChangeLanguage({
        id: `${sourceLang}-${val}`,
        from: sourceLang,
        to: val,
        fromShort: sourceLang.slice(0, 2).toUpperCase(),
        toShort: val.slice(0, 2).toUpperCase(),
        speechLocale: "en-US",
      })
    }
  }

  return (
    <header className="relative z-20 flex items-center justify-between px-4 pt-6 pb-2">
      {/* Nút Menu */}
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Mở menu"
        className="flex size-11 items-center justify-center rounded-full bg-neutral-800/70 text-neutral-100 backdrop-blur transition-colors hover:bg-neutral-700 active:scale-95"
      >
        <Menu className="size-5" />
      </button>

      {/* Bộ chọn ngôn ngữ động với Select component của shadcn */}
      <div className="flex items-center gap-1.5 rounded-full bg-neutral-800/70 p-1 backdrop-blur ring-1 ring-white/10">
        {/* Ngôn ngữ gốc */}
        <Select value={sourceLang} onValueChange={handleSourceChange}>
          <SelectTrigger className="border-none bg-transparent px-3 py-1.5 text-xs font-medium text-neutral-100 shadow-none hover:bg-neutral-700/50">
            <SelectValue placeholder="Gốc">{sourceLang}</SelectValue>
          </SelectTrigger>
          <SelectContent className="w-36">
            {LANGUAGES.map((lang) => (
              <SelectItem key={`source-${lang}`} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ArrowRight className="size-3.5 shrink-0 text-amber-400" />

        {/* Ngôn ngữ đích */}
        <Select value={targetLang} onValueChange={handleTargetChange}>
          <SelectTrigger className="border-none bg-transparent px-3 py-1.5 text-xs font-medium text-neutral-100 shadow-none hover:bg-neutral-700/50">
            <SelectValue placeholder="Đích">{targetLang}</SelectValue>
          </SelectTrigger>
          <SelectContent className="w-36">
            {LANGUAGES.map((lang) => (
              <SelectItem key={`target-${lang}`} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  )
}
