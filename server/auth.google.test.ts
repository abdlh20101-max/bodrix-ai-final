import { describe, expect, it } from "vitest";

describe("Google OAuth Configuration", () => {
  it("should have Google OAuth credentials configured", () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    // Check that credentials are provided
    expect(clientId).toBeDefined();
    expect(clientSecret).toBeDefined();
    expect(clientId).toBeTruthy();
    expect(clientSecret).toBeTruthy();

    // Validate format (Google Client ID ends with .apps.googleusercontent.com)
    expect(clientId).toMatch(/\.apps\.googleusercontent\.com$/);

    // Validate that secret is not empty
    expect(clientSecret?.length).toBeGreaterThan(0);
  });

  it("should have valid Google Client ID format", () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    expect(clientId).toMatch(/^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/);
  });

  it("should have valid Google Client Secret format", () => {
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    // Google secrets are typically alphanumeric with some special characters
    expect(clientSecret).toMatch(/^[a-zA-Z0-9_-]+$/);
  });
});
