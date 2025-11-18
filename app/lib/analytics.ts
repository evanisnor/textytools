/**
 * Google Tag Manager event tracking utilities
 */

interface BaseEventParams {
  tool: string;
  [key: string]: unknown;
}

/**
 * Track a copy button click event
 * @param params - Event parameters including tool name and any custom parameters
 * @example
 * trackCopyEvent({ tool: "text-encoder", mode: "encode" })
 * trackCopyEvent({ tool: "jwt-decoder" })
 * trackCopyEvent({ tool: "json-wizard", format: "pretty" })
 */
export function trackCopyEvent(params: BaseEventParams) {
  if (typeof window !== "undefined" && window.dataLayer) {
    const { tool, ...customParams } = params;
    window.dataLayer.push({
      event: "copy_button_click",
      tool_name: tool,
      ...customParams,
    });
  }
}
