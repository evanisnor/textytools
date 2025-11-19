/**
 * Google Tag Manager event tracking utilities
 */

interface BaseEventParams {
  tool: string;
  [key: string]: unknown;
}

interface ToolConversionParams {
  sourceTool: string;
  destinationTool: string;
  [key: string]: unknown;
}

/**
 * Check if we're in development mode
 */
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Track a copy button click event
 * @param params - Event parameters including tool name and any custom parameters
 * @example
 * trackCopyEvent({ tool: "text-encoder", mode: "encode" })
 * trackCopyEvent({ tool: "jwt-decoder" })
 * trackCopyEvent({ tool: "json-wizard", format: "pretty" })
 */
export function trackCopyEvent(params: BaseEventParams) {
  // Skip tracking in development mode
  if (isDevelopment) {
    console.log("[Analytics - Dev Mode - Copy]", params);
    return;
  }

  if (typeof window !== "undefined" && window.dataLayer) {
    const { tool, ...customParams } = params;
    window.dataLayer.push({
      event: "copy_button_click",
      tool_name: tool,
      ...customParams,
    });
  }
}

/**
 * Track cross-tool navigation/conversion
 * This helps measure tool cohesion and user workflow patterns
 * @param params - Conversion parameters including source and destination tools
 * @example
 * trackToolConversion({ sourceTool: "jwt-decoder", destinationTool: "json-wizard" })
 * trackToolConversion({ sourceTool: "json-wizard", destinationTool: "csv-json-converter", viewMode: "pretty" })
 */
export function trackToolConversion(params: ToolConversionParams) {
  // Skip tracking in development mode
  if (isDevelopment) {
    console.log("[Analytics - Dev Mode - Conversion]", params);
    return;
  }

  if (typeof window !== "undefined" && window.dataLayer) {
    const { sourceTool, destinationTool, ...customParams } = params;
    window.dataLayer.push({
      event: "tool_conversion",
      source_tool: sourceTool,
      destination_tool: destinationTool,
      workflow: `${sourceTool}_to_${destinationTool}`,
      ...customParams,
    });
  }
}

/**
 * Track clear button click event
 * This helps understand user engagement and when users reset their work
 * @param params - Event parameters including tool name and any custom parameters
 * @example
 * trackClearEvent({ tool: "json-wizard", viewMode: "pretty" })
 * trackClearEvent({ tool: "text-encoder", mode: "encode" })
 */
export function trackClearEvent(params: BaseEventParams) {
  // Skip tracking in development mode
  if (isDevelopment) {
    console.log("[Analytics - Dev Mode - Clear]", params);
    return;
  }

  if (typeof window !== "undefined" && window.dataLayer) {
    const { tool, ...customParams } = params;
    window.dataLayer.push({
      event: "clear_button_click",
      tool_name: tool,
      ...customParams,
    });
  }
}

/**
 * Track toggle all button click event
 * This helps understand when users enable or disable all options in bulk
 * @param params - Event parameters including tool name, action (enable/disable), and any custom parameters
 * @example
 * trackToggleAllEvent({ tool: "text-sanitizer", action: "enable" })
 * trackToggleAllEvent({ tool: "text-sanitizer", action: "disable" })
 */
export function trackToggleAllEvent(
  params: BaseEventParams & { action: "enable" | "disable" },
) {
  // Skip tracking in development mode
  if (isDevelopment) {
    console.log("[Analytics - Dev Mode - Toggle All]", params);
    return;
  }

  if (typeof window !== "undefined" && window.dataLayer) {
    const { tool, action, ...customParams } = params;
    window.dataLayer.push({
      event: "toggle_all_click",
      tool_name: tool,
      action,
      ...customParams,
    });
  }
}
