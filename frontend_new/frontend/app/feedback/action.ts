"use server";
import { Resend } from "resend";

export const SendEmail = async (
  starRating: number,
  feedbackComment: string,
) => {
  "use server";
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "BioMate Feedback <onboarding@resend.dev>",
      to: "newprabunp@gmail.com",
      subject: `BioMate Feedback: ${starRating} Stars`,
      html: `
          <div style="font-family: sans-serif; padding: 20px; color: #334155;">
            <h2 style="color: #059669;">New Feedback Received for BioMate</h2>
            <p><strong>Rating:</strong> ${starRating} / 5 Stars</p>
            <p><strong>Comments:</strong></p>
            <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #10b981;">
              ${feedbackComment || "No comment provided."}
            </div>
          </div>
        `,
    });
    //   setIsSubmitted(true);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
