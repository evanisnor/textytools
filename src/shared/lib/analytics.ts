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
 * Analytics enablement flag.
 * By default only enabled in production, but can be forced on in development
 * by setting `NEXT_PUBLIC_ENABLE_ANALYTICS=true` in your environment.
 */
const analyticsEnabled =
  process.env.NODE_ENV === "production" ||
  process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";

/**
 * Send an event to gtag (GA4) when available.
 */
function sendEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  try {
    const analyticsWindow = window as typeof window & {
      dataLayer?: unknown[][];
      gtag?: (...args: unknown[]) => void;
    };

    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    const gtag =
      analyticsWindow.gtag ||
      function (...args: unknown[]) {
        analyticsWindow.dataLayer?.push(args);
      };

    gtag("event", name, {
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...params,
    });
  } catch (err) {
    // Analytics must never interfere with the tool itself.
    console.warn("Unable to queue analytics event", err);
  }
}

/** Track a tool landing page view independently of its changing page title. */
export function trackToolView(params: BaseEventParams) {
  if (!analyticsEnabled) return;

  const { tool, ...customParams } = params;
  sendEvent("tool_view", { tool_name: tool, ...customParams });
}

/** Track the first meaningful input interaction in a tool session. */
export function trackToolActivation(params: BaseEventParams) {
  if (!analyticsEnabled) return;

  const { tool, ...customParams } = params;
  sendEvent("tool_activation", { tool_name: tool, ...customParams });
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
  // Skip tracking unless analytics is enabled
  if (!analyticsEnabled) {
    console.log("[Analytics - Disabled] copy", params);
    return;
  }

  const { tool, ...customParams } = params;
  sendEvent("copy_button_click", { tool_name: tool, ...customParams });
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
  // Skip tracking unless analytics is enabled
  if (!analyticsEnabled) {
    console.log("[Analytics - Disabled] conversion", params);
    return;
  }

  const { sourceTool, destinationTool, ...customParams } = params;
  sendEvent("tool_conversion", {
    source_tool: sourceTool,
    destination_tool: destinationTool,
    workflow: `${sourceTool}_to_${destinationTool}`,
    ...customParams,
  });
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
  // Skip tracking unless analytics is enabled
  if (!analyticsEnabled) {
    console.log("[Analytics - Disabled] clear", params);
    return;
  }

  const { tool, ...customParams } = params;
  sendEvent("clear_button_click", { tool_name: tool, ...customParams });
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
  // Skip tracking unless analytics is enabled
  if (!analyticsEnabled) {
    console.log("[Analytics - Disabled] toggle_all", params);
    return;
  }

  const { tool, action, ...customParams } = params;
  sendEvent("toggle_all_click", { tool_name: tool, action, ...customParams });
}

/**
 * Track feedback modal open event
 * This helps understand when users are engaging with the feedback feature
 * @param params - Event parameters including tool name and any custom parameters
 * @example
 * trackFeedbackOpen({ tool: "json-wizard" })
 */
export function trackFeedbackOpen(params: BaseEventParams) {
  // Skip tracking unless analytics is enabled
  if (!analyticsEnabled) {
    console.log("[Analytics - Disabled] feedback_open", params);
    return;
  }

  const { tool, ...customParams } = params;
  sendEvent("feedback_open", { tool_name: tool, ...customParams });
}

/**
 * Track feedback submission event
 * This helps measure successful feedback submissions
 * @param params - Event parameters including tool name and any custom parameters
 * @example
 * trackFeedbackSubmit({ tool: "json-wizard" })
 */
export function trackFeedbackSubmit(params: BaseEventParams) {
  // Skip tracking unless analytics is enabled
  if (!analyticsEnabled) {
    console.log("[Analytics - Disabled] feedback_submit", params);
    return;
  }

  const { tool, ...customParams } = params;
  sendEvent("feedback_submit", { tool_name: tool, ...customParams });
}
