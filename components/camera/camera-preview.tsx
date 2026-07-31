"use client"

type CameraPreviewProps = {
  facingFront: boolean
}

export function CameraPreview({ facingFront }: CameraPreviewProps) {
  return (
    <div className="relative aspect-square w-[90%] max-w-[21.6rem]">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-neutral-800 shadow-2xl shadow-black/60 ring-1 ring-white/10">
        {/* simulated live camera feed */}
        <img
          src="/chair-preview.png"
          alt="Xem trước camera"
          crossOrigin="anonymous"
          className={`size-full object-cover transition-transform duration-300 ${
            facingFront ? "-scale-x-100" : ""
          }`}
        />

        {/* focus reticle */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-white/70" />

        {/* corner guides */}
        <div className="pointer-events-none absolute inset-4">
          <span className="absolute left-0 top-0 size-6 rounded-tl-xl border-l-2 border-t-2 border-white/60" />
          <span className="absolute right-0 top-0 size-6 rounded-tr-xl border-r-2 border-t-2 border-white/60" />
          <span className="absolute bottom-0 left-0 size-6 rounded-bl-xl border-b-2 border-l-2 border-white/60" />
          <span className="absolute bottom-0 right-0 size-6 rounded-br-xl border-b-2 border-r-2 border-white/60" />
        </div>

        {/* live badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur">
          <span className="size-1.5 animate-pulse rounded-full bg-green-500" />
          <span className="text-[11px] font-medium tracking-wide text-white/90">LIVE</span>
        </div>
      </div>
    </div>
  )
}
