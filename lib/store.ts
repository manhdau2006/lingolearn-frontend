import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface Folder {
  id: string
  name: string
  createdAt: number
}

export interface Vocabulary {
  id: string
  folderId: string
  originalWord: string
  wordType: string
  translatedWord: string
  ipa: string
  imageUrl: string
  createdAt: number
}

type StoreState = {
  folders: Folder[]
  vocabularies: Vocabulary[]

  // Folder Actions
  addFolder: (name: string) => void
  deleteFolder: (id: string) => void
  updateFolder: (id: string, newName: string) => void

  // Vocabulary Actions
  addVocabulary: (vocab: Omit<Vocabulary, "id" | "createdAt">) => void
  deleteVocabulary: (id: string) => void
}

const DEFAULT_FOLDERS: Folder[] = [
  { id: "unsaved", name: "#unsaved", createdAt: Date.now() },
  { id: "phong-khach", name: "#phòng_khách", createdAt: Date.now() - 1000 },
  { id: "ngoai-troi", name: "#ngoài_trời", createdAt: Date.now() - 2000 },
  { id: "cong-so", name: "#công_sở", createdAt: Date.now() - 3000 },
]

export const useAppStore = create<StoreState>()(
  persist(
    (set) => ({
      folders: DEFAULT_FOLDERS,
      vocabularies: [],

      addFolder: (name: string) => {
        const cleanName = name.trim()
        if (!cleanName) return
        const formattedName = cleanName.startsWith("#")
          ? cleanName
          : `#${cleanName.replace(/\s+/g, "_").toLowerCase()}`
        const id = cleanName.replace(/\s+/g, "-").toLowerCase() + `-${Date.now()}`

        const newFolder: Folder = {
          id,
          name: formattedName,
          createdAt: Date.now(),
        }

        set((state) => ({
          folders: [newFolder, ...state.folders],
        }))
      },

      deleteFolder: (id: string) => {
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          vocabularies: state.vocabularies.filter((v) => v.folderId !== id),
        }))
      },

      updateFolder: (id: string, newName: string) => {
        const cleanName = newName.trim()
        if (!cleanName) return
        const formattedName = cleanName.startsWith("#")
          ? cleanName
          : `#${cleanName.replace(/\s+/g, "_").toLowerCase()}`

        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === id ? { ...f, name: formattedName } : f
          ),
        }))
      },

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

      deleteVocabulary: (id: string) => {
        set((state) => ({
          vocabularies: state.vocabularies.filter((v) => v.id !== id),
        }))
      },
    }),
    {
      name: "lingolearn-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
