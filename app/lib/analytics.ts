/**
 * Google Tag Manager event tracking utilities
 */

interface BaseEventParams {
  tool: string;
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
    console.log("[Analytics - Dev Mode]", params);
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
