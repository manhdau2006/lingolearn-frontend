"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Folder, MoreVertical, Pencil, Trash2, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

type SavedFolder = {
  id: string
  name: string
  hash: string
  count: number
}

const INITIAL_FOLDERS: SavedFolder[] = [
  { id: "phong-khach", name: "Phòng khách", hash: "#phòng_khách", count: 12 },
  { id: "ngoai-troi", name: "Ngoài trời", hash: "#ngoài_trời", count: 18 },
  { id: "cong-so", name: "Công sở", hash: "#công_sở", count: 24 },
  { id: "du-lich", name: "Du lịch", hash: "#du_lịch", count: 15 },
  { id: "hoc-tap", name: "Học tập", hash: "#học_tập", count: 9 },
  { id: "untitled1", name: "Thư mục 1", hash: "#untitled1", count: 5 },
]

export default function SavedFoldersPage() {
  const [folders, setFolders] = useState<SavedFolder[]>(INITIAL_FOLDERS)

  // Dialog States
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<SavedFolder | null>(null)
  const [renameInput, setRenameInput] = useState("")

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingFolder, setDeletingFolder] = useState<SavedFolder | null>(null)

  // Create folder handler
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return
    const cleanName = newFolderName.trim()
    const hash = cleanName.startsWith("#") ? cleanName : `#${cleanName.replace(/\s+/g, "_").toLowerCase()}`
    const id = cleanName.replace(/\s+/g, "-").toLowerCase() + `-${Date.now()}`

    const newFolder: SavedFolder = {
      id,
      name: cleanName,
      hash,
      count: 0,
    }

    setFolders((prev) => [newFolder, ...prev])
    setNewFolderName("")
    setCreateDialogOpen(false)
  }

  // Rename folder handler
  const handleRenameFolder = () => {
    if (!editingFolder || !renameInput.trim()) return
    const cleanName = renameInput.trim()
    const hash = cleanName.startsWith("#") ? cleanName : `#${cleanName.replace(/\s+/g, "_").toLowerCase()}`

    setFolders((prev) =>
      prev.map((f) => (f.id === editingFolder.id ? { ...f, name: cleanName, hash } : f))
    )
    setEditingFolder(null)
    setRenameInput("")
    setRenameDialogOpen(false)
  }

  // Delete folder handler
  const handleDeleteFolder = () => {
    if (!deletingFolder) return
    setFolders((prev) => prev.filter((f) => f.id !== deletingFolder.id))
    setDeletingFolder(null)
    setDeleteDialogOpen(false)
  }

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

          <h1 className="text-base font-bold text-neutral-100">
            Bộ sưu tập
          </h1>

          {/* + Tạo thư mục mới button */}
          <button
            type="button"
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-1 rounded-full bg-amber-400/15 px-3 py-1.5 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-400/25 active:scale-95"
          >
            <Plus className="size-3.5" />
            <span>Tạo mới</span>
          </button>
        </header>

        {/* Content Section */}
        <main className="flex-1">
          {/* Subtitle / Folder Count */}
          <div className="mb-4 flex items-center justify-between px-1">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              Tất cả thư mục ({folders.length})
            </span>
          </div>

          {/* Grid Layout (2 columns on mobile) */}
          <div className="grid grid-cols-2 gap-3.5">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="group relative flex h-full flex-col justify-between rounded-2xl bg-white p-4 text-neutral-900 shadow-sm ring-1 ring-neutral-200/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-amber-400/60"
              >
                {/* 3-dots Dropdown Menu positioned top-right */}
                <div className="absolute right-2 top-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="flex size-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                      aria-label="Tùy chọn thư mục"
                    >
                      <MoreVertical className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36 border-neutral-800 bg-neutral-900 text-neutral-100 shadow-xl">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingFolder(folder)
                          setRenameInput(folder.name)
                          setRenameDialogOpen(true)
                        }}
                        className="cursor-pointer text-xs"
                      >
                        <Pencil className="size-3.5 text-amber-400" />
                        <span>Đổi tên</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setDeletingFolder(folder)
                          setDeleteDialogOpen(true)
                        }}
                        className="cursor-pointer text-xs text-red-400 hover:bg-red-500/15 hover:text-red-300 focus:bg-red-500/15 focus:text-red-300"
                      >
                        <Trash2 className="size-3.5 text-red-400" />
                        <span>Xóa</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Clickable Card Link area */}
                <Link href={`/saved/${folder.id}`} className="block flex-1 pt-1">
                  {/* Icon & Hash */}
                  <div className="mb-3 flex items-center justify-between pr-6">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                      <Folder className="size-5" />
                    </div>
                  </div>

                  {/* Hash tag badge */}
                  <span className="mb-1 block text-xs font-semibold text-amber-600">
                    {folder.hash}
                  </span>

                  {/* Folder Title */}
                  <h2 className="line-clamp-1 text-base font-semibold text-neutral-900 group-hover:text-amber-600">
                    {folder.name}
                  </h2>

                  {/* Word Count */}
                  <p className="mt-4 text-xs font-medium text-neutral-500">
                    {folder.count} từ mới
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </main>

        {/* Dialog 1: Create New Folder */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="w-[85%] max-w-xs rounded-3xl border-neutral-800 bg-neutral-900 p-5 text-neutral-50">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-neutral-50">Tạo thư mục mới</DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                Nhập tên thư mục để phân loại từ vựng của bạn.
              </DialogDescription>
            </DialogHeader>

            <div className="my-2">
              <input
                type="text"
                placeholder="Ví dụ: Phòng bếp, Trường học..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder()
                }}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-800/80 px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                autoFocus
              />
            </div>

            <DialogFooter className="flex gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setCreateDialogOpen(false)}
                className="flex-1 rounded-xl bg-neutral-800 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCreateFolder}
                className="flex-1 rounded-xl bg-amber-400 py-2.5 text-xs font-semibold text-neutral-900 hover:bg-amber-300"
              >
                Tạo thư mục
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog 2: Rename Folder */}
        <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
          <DialogContent className="w-[85%] max-w-xs rounded-3xl border-neutral-800 bg-neutral-900 p-5 text-neutral-50">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-neutral-50">Đổi tên thư mục</DialogTitle>
              <DialogDescription className="text-xs text-neutral-400">
                Nhập tên mới cho thư mục <span className="font-semibold text-amber-400">{editingFolder?.name}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="my-2">
              <input
                type="text"
                placeholder="Tên thư mục mới..."
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameFolder()
                }}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-800/80 px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                autoFocus
              />
            </div>

            <DialogFooter className="flex gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setRenameDialogOpen(false)}
                className="flex-1 rounded-xl bg-neutral-800 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleRenameFolder}
                className="flex-1 rounded-xl bg-amber-400 py-2.5 text-xs font-semibold text-neutral-900 hover:bg-amber-300"
              >
                Lưu thay đổi
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog 3: Delete Confirmation */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="w-[85%] max-w-xs rounded-3xl border-neutral-800 bg-neutral-900 p-5 text-neutral-50">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-red-400">Xóa thư mục?</DialogTitle>
              <DialogDescription className="text-xs text-neutral-300 pt-1">
                Bạn có chắc chắn muốn xóa thư mục <span className="font-semibold text-white">"{deletingFolder?.name}"</span> không? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 rounded-xl bg-neutral-800 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteFolder}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-xs font-semibold text-white hover:bg-red-600"
              >
                Xóa thư mục
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}