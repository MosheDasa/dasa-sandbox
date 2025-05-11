import React, { useState } from "react";
import { PocComponentProps } from "../../types/common";
import { theme } from "../../styles/theme";
import {
  performOCR,
  generateImage,
  summarizeText,
  translateText,
  OCRResponse,
  ImageGenerationResponse,
  SummarizationResponse,
  TranslationResponse,
} from "./api";

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

interface ServiceResult {
  type: Tool;
  rawResponse?:
    | OCRResponse
    | ImageGenerationResponse
    | SummarizationResponse
    | TranslationResponse;
  processedResult: string;
  timestamp: Date;
  status: "success" | "error";
  originalInput: string | File;
}

interface ResultDisplayProps {
  result: ServiceResult;
  style?: React.CSSProperties;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, style }) => {
  return (
    <div style={{ ...styles.resultContainer, ...style }}>
      <div style={styles.resultHeader}>
        <div style={styles.resultTitle}>{getResultTitle(result.type)}</div>
        <div style={styles.resultMeta}>
          <span style={styles.resultStatus}>
            {result.status === "success" ? "✓ Success" : "✗ Failed"}
          </span>
          <span style={styles.resultTime}>
            {result.timestamp.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div style={styles.resultSections}>
        {/* Application Result Section */}
        <div style={styles.resultSection}>
          <div style={styles.sectionHeader}>Application Result</div>
          <div style={styles.sectionContent}>
            {result.status === "error" ? (
              <div style={styles.resultError}>{result.processedResult}</div>
            ) : result.type === "text-to-image" ? (
              <img
                src={result.processedResult}
                alt="Generated"
                style={styles.resultImage}
              />
            ) : (
              <pre style={styles.resultText}>{result.processedResult}</pre>
            )}
          </div>
        </div>

        {/* API Response Section */}
        <div style={styles.resultSection}>
          <div style={styles.sectionHeader}>API Response</div>
          <div style={styles.sectionContent}>
            <pre style={styles.rawResponse}>
              {JSON.stringify(result.rawResponse || {}, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const getResultTitle = (tool: Tool): string => {
  switch (tool) {
    case "ocr":
      return "Extracted Text";
    case "text-to-image":
      return "Generated Image";
    case "summarize":
      return "Summary";
    case "translate":
      return "Translation";
    default:
      return "Result";
  }
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: theme.spacing.sm,
    height: "100%",
    overflow: "hidden",
    padding: 0,
    width: "100%",
    maxWidth: "100%",
  },
  toolGrid: {
    display: "flex",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    flexShrink: 0,
    minHeight: "90px",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    background: theme.colors.background.paper,
    flexWrap: "wrap" as const,
    overflow: "auto",
  },
  toolCard: (isActive: boolean) => ({
    background: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: `2px solid ${isActive ? theme.colors.primary.main : "transparent"}`,
    cursor: "pointer",
    transition: "all 0.2s ease",
    flex: "1 1 auto",
    minWidth: "180px",
    maxWidth: "220px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: isActive ? theme.shadows.md : theme.shadows.sm,
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: theme.shadows.lg,
      borderColor: theme.colors.primary.main,
      background: `${theme.colors.background.elevated}dd`,
    },
  }),
  toolIcon: {
    fontSize: "1.5rem",
    marginBottom: theme.spacing.sm,
    textAlign: "center" as const,
    color: theme.colors.primary.main,
  },
  toolTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    fontSize: "1rem",
    fontWeight: "600",
    textAlign: "center" as const,
  },
  toolDescription: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    fontSize: "0.85rem",
    lineHeight: "1.4",
    textAlign: "center" as const,
    flex: 1,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "90%",
    margin: "0 auto",
  },
  workArea: {
    flex: 1,
    minHeight: 0,
    background: theme.colors.background.paper,
    borderRadius: 0,
    padding: theme.spacing.sm,
    display: "flex",
    flexDirection: "column" as const,
    gap: theme.spacing.sm,
    overflow: "hidden",
    width: "100%",
    maxWidth: "100%",
  },
  inputArea: {
    display: "flex",
    gap: theme.spacing.md,
    flexShrink: 0,
    height: "70px",
    width: "100%",
    maxWidth: "100%",
  },
  textInput: {
    flex: 1,
    background: theme.colors.background.elevated,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: "0.9rem",
    resize: "none" as const,
    height: "100%",
    width: "100%",
    "&:focus": {
      outline: "none",
      borderColor: theme.colors.primary.main,
      boxShadow: theme.shadows.highlight,
    },
  },
  imageInput: {
    width: "80px",
    height: "80px",
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
  controls: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: `${theme.spacing.xs} 0`,
    borderBottom: `1px solid ${theme.colors.border.default}`,
    flexShrink: 0,
    height: "40px",
  },
  button: {
    background: theme.colors.primary.main,
    color: theme.colors.primary.contrastText,
    border: "none",
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
    transition: "all 0.2s ease",
    height: "32px",
    "&:hover": {
      background: theme.colors.primary.dark,
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
    "&:disabled": {
      opacity: 0.7,
      cursor: "not-allowed",
      transform: "none",
    },
  },
  resultContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: theme.spacing.sm,
    background: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    width: "100%",
  },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
    flexShrink: 0,
    height: "32px",
  },
  resultTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    fontSize: "1rem",
    fontWeight: 600,
  },
  resultMeta: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  resultStatus: {
    fontSize: "0.85rem",
    color: theme.colors.text.secondary,
  },
  resultTime: {
    fontSize: "0.85rem",
    color: theme.colors.text.secondary,
  },
  resultSections: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 300px",
    gap: theme.spacing.lg,
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    width: "100%",
    maxWidth: "100%",
  },
  resultSection: {
    display: "flex",
    flexDirection: "column" as const,
    gap: theme.spacing.md,
    background: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    overflow: "hidden",
    minHeight: 0,
    width: "100%",
    boxShadow: theme.shadows.sm,
  },
  sectionHeader: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    fontSize: "1.1rem",
    fontWeight: 600,
    paddingBottom: theme.spacing.sm,
    borderBottom: `1px solid ${theme.colors.border.default}`,
    flexShrink: 0,
    height: "auto",
    marginBottom: theme.spacing.sm,
  },
  sectionContent: {
    flex: 1,
    minHeight: 0,
    overflow: "auto",
    padding: theme.spacing.md,
    width: "100%",
    background: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.md,
  },
  resultText: {
    margin: 0,
    whiteSpace: "pre-wrap" as const,
    fontSize: "1rem",
    lineHeight: "1.6",
    color: theme.colors.text.primary,
    height: "100%",
    width: "100%",
    overflow: "auto",
    padding: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily.sans,
    letterSpacing: "0.01em",
  },
  rawResponse: {
    background: theme.colors.background.elevated,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    fontSize: "0.85rem",
    overflow: "auto",
    height: "100%",
    width: "100%",
    margin: 0,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.mono,
    lineHeight: "1.4",
  },
  resultImage: {
    maxWidth: "100%",
    height: "100%",
    objectFit: "contain" as const,
    borderRadius: theme.borderRadius.md,
    background: theme.colors.background.elevated,
    padding: theme.spacing.xs,
  },
  resultError: {
    color: theme.colors.error.main,
    padding: theme.spacing.md,
    background: `${theme.colors.error.light}15`,
    borderRadius: theme.borderRadius.md,
    fontSize: "0.9rem",
  },
  processingIndicator: {
    textAlign: "center" as const,
    color: theme.colors.text.secondary,
    padding: theme.spacing.lg,
    fontSize: "0.9rem",
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
    setResult(null); // Reset previous result
    onLog(`Processing with ${selectedTool}...`, "info");

    try {
      let processedResult: string;

      switch (selectedTool) {
        case "ocr":
          if (!inputImage) throw new Error("No image selected");
          processedResult = await performOCR(inputImage);
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

      if (!processedResult) {
        throw new Error("No result received from the API");
      }

      onLog("Processing complete!", "success");
      setResult(processedResult);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      onLog(`Error: ${errorMessage}`, "error");
      setResult(`Error: ${errorMessage}`); // Show error in result area
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
                {inputImage ? (
                  <img
                    src={URL.createObjectURL(inputImage)}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  "Upload Image"
                )}
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

          <div style={styles.controls}>
            <button
              style={styles.button}
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Process"}
            </button>
          </div>

          {isProcessing ? (
            <div style={styles.processingIndicator}>
              <div>Processing your request...</div>
              <div style={styles.resultStatus}>
                {selectedTool === "ocr"
                  ? "Extracting text from image..."
                  : selectedTool === "text-to-image"
                  ? "Generating image from text..."
                  : selectedTool === "summarize"
                  ? "Summarizing text..."
                  : "Translating text..."}
              </div>
            </div>
          ) : result ? (
            <ResultDisplay
              result={{
                type: selectedTool,
                processedResult: result,
                timestamp: new Date(),
                status: result.startsWith("Error:") ? "error" : "success",
                originalInput:
                  selectedTool === "ocr" && inputImage
                    ? inputImage
                    : inputText || "",
              }}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AITools;
