import Link from "next/link"
import { ChevronLeft, Folder } from "lucide-react"

type SavedFolder = {
  id: string
  name: string
  hash: string
  count: number
}

const DUMMY_FOLDERS: SavedFolder[] = [
  { id: "phong-khach", name: "Phòng khách", hash: "#phòng_khách", count: 12 },
  { id: "ngoai-troi", name: "Ngoài trời", hash: "#ngoài_trời", count: 18 },
  { id: "cong-so", name: "Công sở", hash: "#công_sở", count: 24 },
  { id: "du-lich", name: "Du lịch", hash: "#du_lịch", count: 15 },
  { id: "hoc-tap", name: "Học tập", hash: "#học_tập", count: 9 },
  { id: "untitled1", name: "Thư mục 1", hash: "#untitled1", count: 5 },
]

export default function SavedFoldersPage() {
  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-50 antialiased">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-neutral-950 px-4 py-6">
        {/* Header */}
        <header className="relative flex items-center justify-between pb-6">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm font-medium text-neutral-300 transition-colors hover:text-white active:scale-95"
            aria-label="Quay về trang chủ"
          >
            <ChevronLeft className="size-5" />
            <span>Back</span>
          </Link>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-neutral-100">
            Bộ sưu tập
          </h1>

          <div className="w-12" aria-hidden />
        </header>

        {/* Content Section */}
        <main className="flex-1">
          {/* Subtitle / Folder Count */}
          <div className="mb-4 flex items-center justify-between px-1">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Tất cả thư mục ({DUMMY_FOLDERS.length})
            </span>
          </div>

          {/* Grid Layout (2 columns on mobile) */}
          <div className="grid grid-cols-2 gap-3.5">
            {DUMMY_FOLDERS.map((folder) => (
              <Link key={folder.id} href={`/saved/${folder.id}`} className="group block">
                <div className="flex h-full flex-col justify-between rounded-2xl bg-white p-4 text-neutral-900 shadow-sm ring-1 ring-neutral-200/60 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:ring-amber-400/60 active:scale-[0.98]">
                  <div>
                    {/* Icon & Hash */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                        <Folder className="size-5" />
                      </div>
                      <span className="text-xs font-semibold text-amber-600">
                        {folder.hash}
                      </span>
                    </div>

                    {/* Folder Title */}
                    <h2 className="line-clamp-1 text-base font-semibold text-neutral-900 group-hover:text-amber-600">
                      {folder.name}
                    </h2>
                  </div>

                  {/* Word Count */}
                  <p className="mt-4 text-xs font-medium text-neutral-500">
                    {folder.count} từ mới
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}