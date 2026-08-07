import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { image, base64Image, sourceLanguage, targetLanguage } = body

    const rawImage = base64Image || image

    if (!rawImage) {
      return NextResponse.json(
        { error: "Hình ảnh không được để trống" },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

    if (!apiKey || !apiKey.trim()) {
      console.error("LỖI SERVER: Chưa cấu hình GEMINI_API_KEY trong process.env")
      return NextResponse.json(
        { error: "Chưa cấu hình GEMINI_API_KEY trong file .env.local trên server" },
        { status: 500 }
      )
    }

    // Cắt bỏ phần tiền tố data:image/...;base64, nếu có
    const cleanedBase64 = rawImage.includes(";base64,")
      ? rawImage.split(";base64,").pop()!
      : rawImage

    // Trích xuất mimeType từ header data URL hoặc mặc định image/jpeg
    const mimeTypeMatch = rawImage.match(/^data:(image\/\w+);base64,/)
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg"

    // Khởi tạo GoogleGenAI từ SDK mới @google/genai (tương thích hoàn hảo với khóa 'AQ.' mới)
    const ai = new GoogleGenAI({ apiKey })

    const srcLang = sourceLanguage || "Tiếng Việt"
    const tgtLang = targetLanguage || "Tiếng Anh"

    const prompt = `Identify the most prominent object in this image. Translate it from ${srcLang} to ${tgtLang}. Return ONLY a raw JSON object with no markdown formatting, structured exactly like this: {"originalWord": "...", "wordType": "...", "translatedWord": "...", "ipa": "..."}`

    // Danh sách các model Gemini hiện đại được hỗ trợ bởi SDK mới @google/genai
    const candidateModels = [
      "gemini-3.5-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.0-flash-exp",
      "gemini-1.5-flash-latest",
      "gemini-2.5-pro",
      "gemini-2.0-flash",
    ]

    let response = null
    let lastError: unknown = null

    for (const modelName of candidateModels) {
      try {
        console.log(`Đang thử kết nối Gemini model mới: ${modelName}...`)
        response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              inlineData: {
                data: cleanedBase64,
                mimeType: mimeType,
              },
            },
            prompt,
          ],
        })

        if (response && response.text) {
          console.log(`Đã kết nối thành công với model: ${modelName}`)
          break
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err)
        console.warn(`Model ${modelName} chưa sẵn sàng hoặc bị lỗi:`, errMsg)
        lastError = err

        // Nếu là lỗi 429 Quota Exceeded thì lập tức ngắt vòng lặp để fallback
        if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota exceeded")) {
          break
        }
      }
    }

    if (!response || !response.text) {
      const errString = lastError instanceof Error ? lastError.message : String(lastError)

      // Xử lý khi chạm hạn ngạch 429 Rate Limit
      if (errString.includes("429") || errString.includes("RESOURCE_EXHAUSTED") || errString.includes("Quota exceeded")) {
        console.warn("HẠN NGẠCH 429: Đã chạm giới hạn request Gemini miễn phí. Tự động chuyển sang dữ liệu thử nghiệm.")
        return NextResponse.json({
          originalWord: "Cái ghế",
          wordType: "danh từ",
          translatedWord: "Chair",
          ipa: "/tʃeər/",
          isFallback: true,
          warningMessage: "Đã hết hạn ngạch Gemini miễn phí tạm thời (Lỗi 429). Đang dùng dữ liệu nhận diện thử nghiệm.",
        })
      }

      throw lastError || new Error("Không có Gemini model nào khả dụng với API Key này.")
    }

    const textResponse = response.text || ""

    // Loại bỏ các thẻ markdown ```json nếu Gemini tự động bọc vào
    const cleanedText = textResponse
      .replace(/```json\n?/gi, "")
      .replace(/```\n?/g, "")
      .trim()

    const jsonResult = JSON.parse(cleanedText)
    console.log("Kết quả từ Gemini AI SDK mới (@google/genai):", jsonResult)

    return NextResponse.json(jsonResult)
  } catch (error: unknown) {
    console.error("Lỗi khi kết nối với Gemini AI bằng SDK @google/genai:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Có lỗi xảy ra khi xử lý nhận diện hình ảnh với Gemini AI",
      },
      { status: 500 }
    )
  }
}
