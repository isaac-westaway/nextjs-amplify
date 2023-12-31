import { NextRequest, NextResponse } from "next/server";

import nodemailer from "nodemailer";
import { render } from "@react-email/components";

import { RateLimiterMemory } from "rate-limiter-flexible";
import { Email } from "@/components/Email";

const smtpEmail = "noreply.wyndigitalagency@gmail.com";
const smtpPass = "yfnqpjawhecvkjfc";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  secure: false,
  auth: {
    user: smtpEmail, // Will be changed to an env variable
    pass: smtpPass, // Will be changed to an env variable
  }})

  
const rateLimiter = new RateLimiterMemory({
    points: 2,
    duration: 120,
  });
  
  type RateLimiterResponse = {
    msBeforeNext: number;
    remainingPoints: number;
    consumedPoints: number;
    isFirstInDuration: boolean;
  };

  
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    if (minutes === 0) {
      return `${remainingSeconds} second${remainingSeconds === 1 ? "" : "s"}`;
    }
  
    if (remainingSeconds === 0) {
      return `${minutes} minute${minutes === 1 ? "" : "s"}`;
    }
  
    return `${minutes} minute${
      minutes === 1 ? "" : "s"
    } and ${remainingSeconds} second${remainingSeconds === 1 ? "" : "s"}`;
  }

  export async function POST(req: NextRequest, res: NextResponse) {
    const clientIp =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for") ||
      req.headers.get("cf-connecting-ip");
  
    if (!clientIp) {
      return new NextResponse(
        JSON.stringify({ error: "Client IP address not found in headers." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  
    const body = await req.json();
  
    const { name, email, booleanValue } = body;
  
  
      const emailHtml = render(
        <Email
          name={name}
          email={email}
          booleanValue={booleanValue}
        />
      );
  
      const BusinessOptions = {
        from: smtpEmail,
        to: ["i.westaway3119@gmail.com", email],
        bcc: "wyndigitalagency@gmail.com",
        subject: "Amplify Test",
        html: emailHtml,
      };
  
      try {
        const rateLimiterResponse: RateLimiterResponse =
          await rateLimiter.consume(clientIp);
  
        await transporter.sendMail(BusinessOptions);
  
        return NextResponse.json({ success: true });
      } catch (rateLimiterResponse) {
        const secondsRemaining = Math.ceil(
          (rateLimiterResponse as RateLimiterResponse).msBeforeNext / 1000
        );
  
        const formattedTime = formatTime(secondsRemaining);
  
        const errorMessage = `Rate limit exceeded. Try again in ${formattedTime}`;
  
        return new NextResponse(JSON.stringify({ error: errorMessage }), {
          status: 429,
          headers: { "Content-Type": "application/json" },
        });
      }
    
  }