import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { captchaToken } = req.body;

  if (!captchaToken) {
    return res
      .status(400)
      .json({ success: false, message: "CAPTCHA token missing" });
  }

  try {
    // Send token to Cloudflare siteverify endpoint
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY || "",
          response: captchaToken,
        }),
      },
    );

    const outcome = await response.json();

    if (!outcome.success) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid CAPTCHA." });
    }

    // Token verified! Process rest of form payload here (e.g., save to DB)
    return res
      .status(200)
      .json({ success: true, message: "Verification successful" });
  } catch (error) {
    console.error("Internal server error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
