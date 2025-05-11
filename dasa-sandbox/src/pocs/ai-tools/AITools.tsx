import React, { useState } from "react";
import { PocComponentProps } from "../../types/common";
import { theme } from "../../styles/theme";
import { performOCR, generateImage, summarizeText, translateText } from "./api";

type Tool = "ocr" | "text-to-image" | "summarize" | "translate";

interface ToolInfo {
  id: Tool;
  title: string;
  description: string;
  apiEndpoint: string;
  icon: string; // Emoji as placeholder
}

const TOOLS: ToolInfo[] = [
  {
    id: "ocr",
    title: "Image to Text",
    description: "Extract text from images using Tesseract.js OCR",
    apiEndpoint: "https://api.ocr.space/parse/image",
    icon: "📷",
  },
  {
    id: "text-to-image",
    title: "Text to Image",
    description:
      "Generate images from text descriptions using Stable Diffusion",
    apiEndpoint: "https://api.deepai.org/api/text2img",
    icon: "🎨",
  },
  {
    id: "summarize",
    title: "Text Summarizer",
    description: "Summarize long texts using GPT-J via API",
    apiEndpoint: "https://api.textcortex.com/v1/texts/summarizations",
    icon: "📝",
  },
  {
    id: "translate",
    title: "AI Translator",
    description: "Translate text using LibreTranslate API",
    apiEndpoint: "https://libretranslate.de/translate",
    icon: "🌐",
  },
];

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: theme.spacing.xl,
    height: "100%",
    overflow: "hidden",
  },
  toolGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: theme.spacing.xl,
    padding: theme.spacing.md,
    overflow: "auto",
  },
  toolCard: (isActive: boolean) => ({
    background: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    border: `1px solid ${
      isActive ? theme.colors.primary.main : theme.colors.border.default
    }`,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: theme.shadows.md,
      borderColor: theme.colors.primary.main,
    },
  }),
  toolIcon: {
    fontSize: "2rem",
    marginBottom: theme.spacing.md,
  },
  toolTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  toolDescription: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  workArea: {
    flex: 1,
    minHeight: 0,
    background: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    display: "flex",
    flexDirection: "column" as const,
    gap: theme.spacing.xl,
    overflow: "auto",
  },
  inputArea: {
    display: "flex",
    gap: theme.spacing.xl,
  },
  textInput: {
    flex: 1,
    background: theme.colors.background.elevated,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.body.fontSize,
    resize: "none" as const,
    minHeight: "150px",
    "&:focus": {
      outline: "none",
      borderColor: theme.colors.primary.main,
      boxShadow: theme.shadows.highlight,
    },
  },
  imageInput: {
    width: "150px",
    height: "150px",
    background: theme.colors.background.elevated,
    border: `2px dashed ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: theme.colors.text.secondary,
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: theme.colors.primary.main,
      color: theme.colors.primary.main,
    },
  },
  button: {
    background: theme.colors.primary.main,
    color: theme.colors.primary.contrastText,
    border: "none",
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    borderRadius: theme.borderRadius.md,
    cursor: "pointer",
    ...theme.typography.body,
    fontWeight: 600,
    alignSelf: "flex-start",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
    transition: "all 0.2s ease",
    "&:hover": {
      background: theme.colors.primary.dark,
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },
  resultArea: {
    flex: 1,
    minHeight: 0,
    background: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    overflow: "auto",
  },
  resultImage: {
    maxWidth: "100%",
    borderRadius: theme.borderRadius.md,
  },
  resultText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    whiteSpace: "pre-wrap" as const,
  },
};

const AITools: React.FC<PocComponentProps> = ({ onLog }) => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [inputText, setInputText] = useState("");
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    setResult(null);
    setInputText("");
    setInputImage(null);
    onLog(`Selected tool: ${tool}`, "info");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputImage(file);
      onLog(`Image uploaded: ${file.name}`, "info");
    }
  };

  const handleProcess = async () => {
    if (!selectedTool) return;

    if (selectedTool === "ocr" && !inputImage) {
      onLog("Please upload an image first", "error");
      return;
    }

    if (selectedTool !== "ocr" && !inputText.trim()) {
      onLog("Please enter some text first", "error");
      return;
    }

    setIsProcessing(true);
    onLog(`Processing with ${selectedTool}...`, "info");

    try {
      let processedResult: string;

      switch (selectedTool) {
        case "ocr":
          processedResult = await performOCR(inputImage!);
          break;
        case "text-to-image":
          processedResult = await generateImage(inputText);
          break;
        case "summarize":
          processedResult = await summarizeText(inputText);
          break;
        case "translate":
          processedResult = await translateText(inputText);
          break;
        default:
          throw new Error("Invalid tool selected");
      }

      setResult(processedResult);
      onLog("Processing complete!", "success");
    } catch (error: unknown) {
      onLog(
        `Error: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`,
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.toolGrid}>
        {TOOLS.map((tool) => (
          <div
            key={tool.id}
            style={styles.toolCard(selectedTool === tool.id)}
            onClick={() => handleToolSelect(tool.id)}
          >
            <div style={styles.toolIcon}>{tool.icon}</div>
            <h3 style={styles.toolTitle}>{tool.title}</h3>
            <p style={styles.toolDescription}>{tool.description}</p>
          </div>
        ))}
      </div>

      {selectedTool && (
        <div style={styles.workArea}>
          <div style={styles.inputArea}>
            {selectedTool === "ocr" ? (
              <label style={styles.imageInput}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                {inputImage ? inputImage.name : "Upload Image"}
              </label>
            ) : (
              <textarea
                style={styles.textInput}
                placeholder={
                  selectedTool === "text-to-image"
                    ? "Describe the image you want to generate..."
                    : selectedTool === "summarize"
                    ? "Enter the text you want to summarize..."
                    : "Enter the text you want to translate..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            )}
          </div>

          <button
            style={{
              ...styles.button,
              opacity: isProcessing ? 0.7 : 1,
              cursor: isProcessing ? "not-allowed" : "pointer",
            }}
            onClick={handleProcess}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Process"}
          </button>

          {result && (
            <div style={styles.resultArea}>
              {selectedTool === "text-to-image" ? (
                <img src={result} alt="Generated" style={styles.resultImage} />
              ) : (
                <pre style={styles.resultText}>{result}</pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AITools;
