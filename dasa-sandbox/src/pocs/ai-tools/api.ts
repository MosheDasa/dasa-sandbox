// API Response Types
export interface OCRResponse {
  ParsedResults: Array<{
    ParsedText: string;
    ErrorMessage?: string;
  }>;
  IsErroredOnProcessing: boolean;
  ErrorMessage?: string;
}

export interface ImageGenerationResponse {
  output_url: string;
  status?: string;
  error?: string;
}

export interface SummarizationResponse {
  summary: string;
  status: string;
  error?: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: {
    confidence: number;
    language: string;
  };
  error?: string;
}

// OCR using OCR.space API
export const performOCR = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        apikey: "K84952735488957", // Free test API key
      },
      body: formData,
    });

    const data: OCRResponse = await response.json();
    console.log("OCR Response:", data);

    if (data.IsErroredOnProcessing || data.ErrorMessage) {
      throw new Error(data.ErrorMessage || "OCR processing failed");
    }

    if (!data.ParsedResults?.[0]?.ParsedText) {
      throw new Error("Failed to extract text from image");
    }

    return data.ParsedResults[0].ParsedText;
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error(
      "OCR processing failed: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!response.ok) {
    throw new Error("Image generation failed");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
// Text to Image using Stable Diffusion
// export const generateImage = async (prompt: string): Promise<string> => {
//   try {
//     const response = await fetch("https://api.deepai.org/api/text2img", {
//       method: "POST",
//       headers: {
//         "api-key": "quickstart-QUdJIGlzIGNvbWluZy4uLi4K", // Free test API key
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ text: prompt }),
//     });

//     const data: ImageGenerationResponse = await response.json();
//     console.log("Image Generation Response:", data);

//     if (data.error || !data.output_url) {
//       throw new Error(data.error || "No image URL received from the service");
//     }

//     return data.output_url;
//   } catch (error) {
//     console.error("Image Generation Error:", error);
//     throw new Error(
//       "Image generation failed: " +
//         (error instanceof Error ? error.message : "Unknown error")
//     );
//   }
// };

// Text Summarization using TextCortex
export const summarizeText = async (text: string): Promise<string> => {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  const result = await response.json();
  if (result.error || !result[0]?.summary_text) {
    throw new Error("No summary received from the service");
  }

  return result[0].summary_text;
};

// Translation using LibreTranslate
export const translateText = async (
  text: string,
  sourceLang: string = "auto",
  targetLang: string = "en"
): Promise<string> => {
  const response = await fetch(
    "https://translate.argosopentech.com/translate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      }),
    }
  );

  const data = await response.json();
  if (!data.translatedText) {
    throw new Error("No translation received from the service");
  }

  return data.translatedText;
};
