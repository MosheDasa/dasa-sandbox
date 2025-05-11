// OCR using Tesseract.js (client-side)
export const performOCR = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        apikey: "helloworld", // Free test API key
      },
      body: formData,
    });

    const data = await response.json();
    return data.ParsedResults[0].ParsedText;
  } catch (error) {
    throw new Error("OCR processing failed");
  }
};

// Text to Image using Stable Diffusion
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: {
        "api-key": "quickstart-QUdJIGlzIGNvbWluZy4uLi4K", // Free test API key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: prompt }),
    });

    const data = await response.json();
    return data.output_url;
  } catch (error) {
    throw new Error("Image generation failed");
  }
};

// Text Summarization using TextCortex
export const summarizeText = async (text: string): Promise<string> => {
  try {
    const response = await fetch(
      "https://api.textcortex.com/v1/texts/summarizations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer demo_key", // Free test API key
        },
        body: JSON.stringify({
          text,
          mode: "paragraph",
          lang: "en",
          max_tokens: 150,
        }),
      }
    );

    const data = await response.json();
    return data.summary;
  } catch (error) {
    throw new Error("Text summarization failed");
  }
};

// Translation using LibreTranslate
export const translateText = async (
  text: string,
  sourceLang: string = "auto",
  targetLang: string = "en"
): Promise<string> => {
  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
      }),
    });

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    throw new Error("Translation failed");
  }
};
