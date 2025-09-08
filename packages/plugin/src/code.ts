    if (msg.type === "CONNECT") {
      figma.ui.postMessage({ type: "PROGRESS", step: "Opening Mailchimp OAuth..." });

      // Open OAuth URL in user's default browser
      const oauthUrl = `${BACKEND}/auth/mailchimp/start`;

      try {
        // For Figma plugin, we'll show instructions to user
        figma.notify("Opening Mailchimp authorization in your browser...", { timeout: 3000 });

        // Show user-friendly message with next steps
        const message = `
🎯 Mailchimp Authorization Required

1. Click the link that opens in your browser
2. Sign in to your Mailchimp account
3. Grant permission for FigChimp to access your templates and campaigns
4. You'll be redirected back and can continue using the plugin

The authorization page should open automatically.
        `.trim();

        // Since we can't directly open URLs in Figma plugins, show clear instructions
        figma.ui.postMessage({
          type: "OAUTH_REQUIRED",
          url: oauthUrl,
          message: message
        });

        figma.ui.postMessage({ type: "DONE" });

      } catch (error) {
        console.error("OAuth initiation error:", error);
        figma.ui.postMessage({
          type: "ERROR",
          message: "Failed to initiate Mailchimp authorization. Please try again."
        });
      }
    }