"use client"

import { use } from "react"
import Link from "next/link"
import { ChevronLeft, Volume2, Trash2, Layers } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

export default function FolderDetailPage({
  params,
}: {
  params: Promise<{ folderID: string }>
}) {
  const { folderID } = use(params)

  const folders = useAppStore((state) => state.folders)
  const vocabularies = useAppStore((state) => state.vocabularies)
  const deleteVocabulary = useAppStore((state) => state.deleteVocabulary)

  // Lấy thông tin thư mục hiện tại
  const currentFolder = folders.find((f) => f.id === folderID)
  const folderTitle = currentFolder ? currentFolder.hash : `#${folderID}`

  // Lọc từ vựng thuộc thư mục hiện tại
  const folderVocabs = vocabularies.filter((v) => v.folderId === folderID)

  function speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    const utter = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  const handleDelete = (id: string, word: string) => {
    deleteVocabulary(id)
    toast.success(`Đã xóa từ "${word}" khỏi thư mục`)
  }

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-50 antialiased">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-neutral-950 px-4 py-6">
        {/* Header */}
        <header className="relative flex items-center justify-between pb-6">
          <Link
            href="/saved"
            className="flex items-center gap-1 text-sm font-medium text-neutral-300 transition-colors hover:text-white active:scale-95"
            aria-label="Quay về danh sách bộ sưu tập"
          >
            <ChevronLeft className="size-5" />
            <span>Back</span>
          </Link>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-neutral-100">
            {folderTitle}
          </h1>

          <div className="w-12" aria-hidden />
        </header>

        {/* Content Section */}
        <main className="flex-1">
          <div className="mb-4 flex items-center justify-between px-1">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Danh sách từ vựng ({folderVocabs.length})
            </span>
          </div>

          {folderVocabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-800 bg-neutral-900/40 p-8 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                <Layers className="size-6" />
              </div>
              <p className="text-sm font-semibold text-neutral-200">Chưa có từ vựng nào</p>
              <p className="mt-1 text-xs text-neutral-400">
                Hãy quay lại trang chủ và chụp ảnh đồ vật để lưu từ mới vào thư mục này.
              </p>
              <Link
                href="/"
                className="mt-4 rounded-xl bg-amber-400 px-4 py-2 text-xs font-semibold text-neutral-900 transition-colors hover:bg-amber-300"
              >
                Chụp ảnh ngay
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {folderVocabs.map((vocab) => (
                <div
                  key={vocab.id}
                  className="flex items-center gap-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-3 shadow-lg shadow-black/20 transition-colors hover:border-neutral-700"
                >
                  {/* Thumbnail ảnh đã chụp ở bên trái */}
                  <img
                    src={vocab.image || "/chair-preview.png"}
                    alt={vocab.originalWord}
                    crossOrigin="anonymous"
                    className="size-16 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
                  />

                  {/* Từ gốc & Từ dịch ở bên phải */}
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <div className="flex items-baseline gap-1.5">
                      <h2 className="truncate text-base font-semibold text-neutral-50">
                        {vocab.originalWord}
                      </h2>
                      {vocab.partOfSpeech && (
                        <span className="shrink-0 text-xs italic text-neutral-400">
                          ({vocab.partOfSpeech})
                        </span>
                      )}
                    </div>

                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-sm font-medium text-amber-400">
                        {vocab.translatedWord}
                      </span>
                      <button
                        type="button"
                        onClick={() => speak(vocab.translatedWord)}
                        aria-label="Nghe phát âm"
                        className="flex size-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 transition-colors hover:bg-amber-500/25 active:scale-95"
                      >
                        <Volume2 className="size-3.5" />
                      </button>
                    </div>

                    <p className="mt-0.5 font-mono text-[11px] text-neutral-400">
                      {vocab.ipa}
                    </p>
                  </div>

                  {/* Action Xóa */}
                  <button
                    type="button"
                    onClick={() => handleDelete(vocab.id, vocab.originalWord)}
                    aria-label="Xóa từ vựng"
                    className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-neutral-400 transition-colors hover:bg-red-500/15 hover:text-red-400 active:scale-95"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}