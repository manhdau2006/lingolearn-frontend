import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type Folder = {
  id: string
  name: string
  hash: string
  count?: number
}

export type Vocabulary = {
  id: string
  folderId: string
  originalWord: string
  partOfSpeech?: string
  translatedWord: string
  ipa: string
  image: string
  createdAt: number
}

type StoreState = {
  folders: Folder[]
  vocabularies: Vocabulary[]

  // Actions cho Folder
  addFolder: (folder: Folder) => void
  renameFolder: (id: string, name: string, hash: string) => void
  deleteFolder: (id: string) => void

  // Actions cho Từ vựng
  addVocabulary: (vocab: Omit<Vocabulary, "id" | "createdAt">) => void
  deleteVocabulary: (id: string) => void
}

const INITIAL_FOLDERS: Folder[] = [
  { id: "unsaved", name: "Chưa phân loại", hash: "#unsaved" },
  { id: "phong-khach", name: "Phòng khách", hash: "#phòng_khách" },
  { id: "ngoai-troi", name: "Ngoài trời", hash: "#ngoài_trời" },
  { id: "cong-so", name: "Công sở", hash: "#công_sở" },
  { id: "du-lich", name: "Du lịch", hash: "#du_lịch" },
  { id: "hoc-tap", name: "Học tập", hash: "#học_tập" },
  { id: "untitled1", name: "Thư mục 1", hash: "#untitled1" },
]

export const useAppStore = create<StoreState>()(
  persist(
    (set) => ({
      folders: INITIAL_FOLDERS,
      vocabularies: [
        {
          id: "demo-1",
          folderId: "phong-khach",
          originalWord: "Cái ghế",
          partOfSpeech: "danh từ",
          translatedWord: "Chair",
          ipa: "/tʃeər/",
          image: "/chair-preview.png",
          createdAt: Date.now(),
        },
      ],

      addFolder: (folder) =>
        set((state) => ({
          folders: [folder, ...state.folders],
        })),

      renameFolder: (id, name, hash) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === id ? { ...f, name, hash } : f
          ),
        })),

      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          vocabularies: state.vocabularies.filter((v) => v.folderId !== id),
        })),

      addVocabulary: (vocabData) => {
        const newVocab: Vocabulary = {
          ...vocabData,
          id: `vocab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          createdAt: Date.now(),
        }
        set((state) => ({
          vocabularies: [newVocab, ...state.vocabularies],
        }))
      },

      deleteVocabulary: (id) =>
        set((state) => ({
          vocabularies: state.vocabularies.filter((v) => v.id !== id),
        })),
    }),
    {
      name: "lingolearn-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
