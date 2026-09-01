import os
import resend
from dotenv import load_dotenv
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)


RESEND_API_KEY = os.getenv("RESEND_API_KEY")

resend.api_key = RESEND_API_KEY


def send_reset_email(receiver_email: str, reset_link: str):

    if not RESEND_API_KEY:
        raise Exception("RESEND_API_KEY is missing")


    params = {
        "from": "CareerPilot AI <onboarding@resend.dev>",
        "to": [receiver_email],
        "subject": "CareerPilot AI - Reset Your Password",
        "html": f"""
        <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
        ">

            <h1 style="color: #6C63FF;">
                CareerPilot AI
            </h1>

            <h2>Reset Your Password</h2>

            <p>Hello,</p>

            <p>
                We received a request to reset your CareerPilot AI password.
            </p>

            <p>
                Click the button below to reset your password:
            </p>

            <a href="{reset_link}"
               style="
                    display: inline-block;
                    padding: 14px 24px;
                    background-color: #6C63FF;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
               ">
                Reset Password
            </a>

            <p style="margin-top: 25px;">
                This link is valid for <b>15 minutes</b>.
            </p>

            <p>
                If you did not request this password reset, please ignore this email.
            </p>

            <br>

            <p>
                Regards,<br>
                <b>CareerPilot AI Team</b>
            </p>

        </div>
        """
    }


    try:

        email = resend.Emails.send(params)

        print("RESEND EMAIL SENT SUCCESSFULLY:", email)

        return email

    except Exception as e:

        print("RESEND EMAIL ERROR:", str(e))

        raise