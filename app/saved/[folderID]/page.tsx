import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function FolderDetailPage({
  params,
}: {
  params: Promise<{ folderID: string }>
}) {
  const { folderID } = await params

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
            {folderID}
          </h1>

          <div className="w-12" aria-hidden />
        </header>

        <main className="flex-1">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 text-center text-neutral-400">
            Danh sách từ vựng của thư mục <span className="font-semibold text-amber-400">#{folderID}</span> sẽ hiển thị ở đây.
          </div>
        </main>
      </div>
    </div>
  )
}