"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { useAppStore, type Vocabulary, type Folder } from "@/lib/store"
import { playAudio } from "@/lib/audio"
import { Volume2, X, Check, RotateCcw, Folder as FolderIcon, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export default function FlashcardsPage() {
  const folders = useAppStore((state) => state.folders)
  const vocabularies = useAppStore((state) => state.vocabularies)
  
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  
  const [deck, setDeck] = useState<Vocabulary[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  
  // State quản lý hiển thị icon tạm thời
  const [markStatus, setMarkStatus] = useState<'learned' | 'review' | null>(null)

  useEffect(() => {
    if (selectedFolderId) {
      const folderVocabs = vocabularies.filter(v => v.folderId === selectedFolderId)
      setDeck(shuffleArray(folderVocabs))
    }
  }, [selectedFolderId, vocabularies])

  const restart = () => {
    if (selectedFolderId) {
      const folderVocabs = vocabularies.filter(v => v.folderId === selectedFolderId)
      setDeck(shuffleArray(folderVocabs))
    }
    setCurrentIndex(0)
    setStreak(0)
    setIsFlipped(false)
    setMarkStatus(null)
  }

  const goBackToFolders = () => {
    setSelectedFolderId(null)
    setCurrentIndex(0)
    setStreak(0)
    setMaxStreak(0)
    setIsFlipped(false)
    setMarkStatus(null)
    setDeck([])
  }

  const controls = useAnimation()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const resetCardPosition = () => {
    x.set(0)
    controls.set({ x: 0, opacity: 1, rotate: 0 })
    setIsFlipped(false)
    setMarkStatus(null)
  }

  const handleNext = async (remembered: boolean) => {
    if (markStatus !== null) return // Tránh bấm nhiều lần
    
    // Đổi state để hiện icon overlay
    setMarkStatus(remembered ? 'learned' : 'review')
    
    // Đợi 500ms để người dùng nhìn thấy icon
    setTimeout(async () => {
      if (remembered) {
        const newStreak = streak + 1
        setStreak(newStreak)
        setMaxStreak((prev) => Math.max(prev, newStreak))
      } else {
        setStreak(0)
      }
      
      // Animate văng thẻ ra ngoài
      await controls.start({ 
        x: remembered ? 300 : -300, 
        opacity: 0, 
        transition: { duration: 0.2 } 
      })
      
      setCurrentIndex((prev) => prev + 1)
      resetCardPosition()
    }, 500)
  }

  const handleDragEnd = async (e: any, info: any) => {
    if (markStatus !== null) return // Đang chuyển thẻ thì không cho vuốt nữa

    const offset = info.offset.x
    const velocity = info.velocity.x

    if (offset > 100 || velocity > 500) {
      controls.start({ x: offset + 50 }) // Giữ thẻ lệch một chút
      handleNext(true)
    } else if (offset < -100 || velocity < -500) {
      controls.start({ x: offset - 50 })
      handleNext(false)
    } else {
      controls.start({ x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } })
    }
  }

  const handlePrevCard = () => {
    if (currentIndex > 0 && markStatus === null) {
      setCurrentIndex(prev => prev - 1)
      resetCardPosition()
    }
  }

  const handleSkipCard = () => {
    if (markStatus === null) {
      setCurrentIndex(prev => prev + 1)
      resetCardPosition()
    }
  }

  // --- MÀN HÌNH 1: DANH SÁCH THƯ MỤC ---
  if (selectedFolderId === null) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-zinc-950 text-white relative shadow-2xl overflow-hidden p-4 flex flex-col">
        <div className="flex items-center mb-8 mt-4">
          <Link href="/" className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={28} />
          </Link>
          <h1 className="text-2xl font-bold ml-2">Chọn thư mục học</h1>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {folders.map(folder => {
            const vocabCount = vocabularies.filter(v => v.folderId === folder.id).length
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center gap-3 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all active:scale-95"
              >
                <div className="w-14 h-14 bg-zinc-800 text-zinc-300 rounded-full flex items-center justify-center">
                  <FolderIcon size={28} />
                </div>
                <div className="text-center w-full">
                  <h3 className="font-semibold text-zinc-100 line-clamp-1">{folder.name}</h3>
                  <p className="text-sm text-zinc-500 mt-1">{vocabCount} từ vựng</p>
                </div>
              </button>
            )
          })}
        </div>
        {folders.length === 0 && (
          <p className="text-center text-zinc-500 mt-10">Chưa có thư mục nào.</p>
        )}
      </div>
    )
  }

  // --- MÀN HÌNH 2: MINIGAME FLASHCARD ---

  if (deck.length === 0) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-zinc-950 text-white relative shadow-2xl overflow-hidden p-4 flex flex-col items-center justify-center text-center">
        <button 
          onClick={goBackToFolders}
          className="absolute top-6 left-4 flex items-center text-zinc-400 hover:text-white font-medium p-2"
        >
          <ChevronLeft size={24} />
          Quay lại
        </button>
        <div className="w-20 h-20 bg-zinc-900 text-zinc-600 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
          <FolderIcon size={40} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Thư mục trống</h1>
        <p className="text-zinc-500 mb-8">Thư mục này chưa có từ vựng để học.</p>
        <button 
          onClick={goBackToFolders}
          className="px-8 py-3 bg-zinc-800 text-white rounded-full font-semibold hover:bg-zinc-700 transition-colors border border-zinc-700"
        >
          Quay lại thư mục
        </button>
      </div>
    )
  }

  if (currentIndex >= deck.length) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-zinc-950 text-white relative shadow-2xl overflow-hidden p-4 flex flex-col items-center justify-center text-center">
        <button 
          onClick={goBackToFolders}
          className="absolute top-6 left-4 flex items-center text-zinc-400 hover:text-white font-medium p-2"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-4xl font-bold mb-3 text-green-500">Chúc mừng!</h1>
        <p className="text-lg mb-10 text-zinc-400">Bạn đã ôn tập xong!</p>
        
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 mb-10 w-full max-w-xs mx-auto shadow-xl">
          <p className="text-zinc-500 mb-2 font-medium">Chuỗi nhớ liên tiếp cao nhất</p>
          <p className="text-5xl font-black text-amber-500 drop-shadow-md">{maxStreak} 🔥</p>
        </div>

        <div className="flex gap-4 w-full max-w-xs mx-auto">
          <button 
            onClick={goBackToFolders}
            className="flex items-center justify-center px-6 py-4 bg-zinc-800 text-zinc-200 rounded-2xl font-semibold hover:bg-zinc-700 transition-colors flex-1"
          >
            Thư mục
          </button>
          <button 
            onClick={restart}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors shadow-lg flex-1"
          >
            <RotateCcw size={20} />
            Học lại
          </button>
        </div>
      </div>
    )
  }

  const currentVocab = deck[currentIndex]
  if (!currentVocab) return null

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-950 text-white relative shadow-2xl overflow-hidden flex flex-col">
      <div className="p-4 flex flex-col h-full items-center">
        
        {/* Top App Bar */}
        <div className="w-full flex justify-between items-center mb-4 mt-2 relative">
          <button 
            onClick={goBackToFolders}
            className="flex items-center text-zinc-400 hover:text-white font-medium p-2 -ml-2"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 shadow-md">
            <span className="text-sm font-medium text-zinc-500">Streak:</span>
            <span className="font-bold text-amber-500">{streak} 🔥</span>
          </div>
        </div>
        
        <div className="text-xs text-zinc-600 mb-6 font-bold tracking-widest uppercase">
          {currentIndex + 1} / {deck.length}
        </div>

        {/* Card Navigation Header */}
        <div className="w-full max-w-sm flex justify-between items-center mb-6 px-1">
          <button 
            onClick={handlePrevCard}
            disabled={currentIndex === 0 || markStatus !== null}
            className={`flex items-center gap-1.5 text-sm font-semibold transition-colors p-2 -ml-2 rounded-lg ${currentIndex === 0 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
          >
            <ChevronLeft size={18} /> Trở lại
          </button>
          <button 
            onClick={handleSkipCard}
            disabled={markStatus !== null}
            className="flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors p-2 -mr-2 rounded-lg disabled:opacity-50"
          >
            Tiếp theo <ChevronRight size={18} />
          </button>
        </div>

        {/* Flashcard Area */}
        <div className="relative w-full max-w-sm aspect-[3/4] perspective-[1000px] mb-8">
          <motion.div
            className="w-full h-full relative cursor-grab active:cursor-grabbing [transform-style:preserve-3d]"
            style={{ x, rotate, opacity }}
            drag={markStatus === null ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
          >
            <motion.div
              className="w-full h-full relative rounded-[2rem] [transform-style:preserve-3d] shadow-2xl"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={() => {
                if (markStatus === null) setIsFlipped(!isFlipped)
              }}
            >
              {/* Front side */}
              <div className="absolute inset-0 bg-zinc-900 rounded-[2rem] border border-zinc-800 flex flex-col items-center justify-center p-8 overflow-hidden [backface-visibility:hidden]">
                {currentVocab.imageUrl && (
                  <div className="w-48 h-48 relative mb-8 rounded-2xl overflow-hidden border border-zinc-800 flex-shrink-0 bg-zinc-950">
                    <img 
                      src={currentVocab.imageUrl} 
                      alt={currentVocab.originalWord}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h2 className="text-4xl font-bold text-white text-center break-words w-full line-clamp-3">
                  {currentVocab.originalWord}
                </h2>
                <p className="text-zinc-500 text-sm mt-6 font-medium">Nhấn để xem nghĩa</p>
                
                {/* Status Overlay */}
                {markStatus && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 animate-in fade-in zoom-in duration-200">
                    {markStatus === 'learned' ? (
                      <CheckCircle2 size={96} className="text-green-500 bg-zinc-900 rounded-full drop-shadow-[0_0_25px_rgba(34,197,94,0.3)]" />
                    ) : (
                      <XCircle size={96} className="text-red-500 bg-zinc-900 rounded-full drop-shadow-[0_0_25px_rgba(239,68,68,0.3)]" />
                    )}
                  </div>
                )}
              </div>

              {/* Back side */}
              <div 
                className="absolute inset-0 bg-zinc-800 rounded-[2rem] border border-zinc-700 flex flex-col items-center justify-center p-8 [backface-visibility:hidden]"
                style={{ transform: "rotateY(180deg)" }}
              >
                <h2 className="text-3xl font-bold text-white text-center break-words w-full mb-4">
                  {currentVocab.translatedWord}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                  {currentVocab.wordType && (
                    <span className="px-4 py-1.5 bg-zinc-700 text-zinc-300 rounded-lg text-sm font-semibold tracking-wide">
                      {currentVocab.wordType}
                    </span>
                  )}
                  {currentVocab.ipa && (
                    <span className="text-zinc-400 font-serif text-lg">/{currentVocab.ipa}/</span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    playAudio(currentVocab.translatedWord)
                  }}
                  className="p-6 bg-zinc-700 text-white rounded-full shadow-lg hover:bg-zinc-600 hover:scale-110 transition-all active:scale-95 border border-zinc-600"
                >
                  <Volume2 size={36} />
                </button>
                
                <p className="text-zinc-500 text-sm mt-auto font-medium">Nhấn để quay lại</p>

                {/* Status Overlay (back side) */}
                {markStatus && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 animate-in fade-in zoom-in duration-200">
                    {markStatus === 'learned' ? (
                      <CheckCircle2 size={96} className="text-green-500 bg-zinc-800 rounded-full drop-shadow-[0_0_25px_rgba(34,197,94,0.3)]" />
                    ) : (
                      <XCircle size={96} className="text-red-500 bg-zinc-800 rounded-full drop-shadow-[0_0_25px_rgba(239,68,68,0.3)]" />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Controls */}
        <div className="flex gap-4 mt-auto mb-8 w-full max-w-sm px-1">
          <button
            onClick={() => handleNext(false)}
            disabled={markStatus !== null}
            className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-red-900 hover:bg-zinc-800 text-red-500 py-5 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-zinc-900 disabled:hover:border-zinc-800"
          >
            <X size={32} strokeWidth={2.5} />
            <span className="font-bold text-sm tracking-wide">Chưa thuộc</span>
          </button>
          <button
            onClick={() => handleNext(true)}
            disabled={markStatus !== null}
            className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-green-900 hover:bg-zinc-800 text-green-500 py-5 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-zinc-900 disabled:hover:border-zinc-800"
          >
            <Check size={32} strokeWidth={2.5} />
            <span className="font-bold text-sm tracking-wide">Đã thuộc</span>
          </button>
        </div>
      </div>
    </div>
  )
}