import { folders } from '@/lib/vocab-data'
import { SavedFolders } from '@/components/saved-folders'

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-background">
      <SavedFolders folders={folders} />
    </main>
  )
}
