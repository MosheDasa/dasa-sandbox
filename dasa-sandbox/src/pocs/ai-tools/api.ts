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
        apikey: "helloworld", // Free test API key
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

    const data: ImageGenerationResponse = await response.json();
    console.log("Image Generation Response:", data);

    if (data.error || !data.output_url) {
      throw new Error(data.error || "No image URL received from the service");
    }

    return data.output_url;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw new Error(
      "Image generation failed: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
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

    const data: SummarizationResponse = await response.json();
    console.log("Summarization Response:", data);

    if (data.error || !data.summary) {
      throw new Error(data.error || "No summary received from the service");
    }

    return data.summary;
  } catch (error) {
    console.error("Summarization Error:", error);
    throw new Error(
      "Text summarization failed: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
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

    const data: TranslationResponse = await response.json();
    console.log("Translation Response:", data);

    if (!data.translatedText) {
      throw new Error("No translation received from the service");
    }

    return data.translatedText;
  } catch (error) {
    console.error("Translation Error:", error);
    throw new Error(
      "Translation failed: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};
