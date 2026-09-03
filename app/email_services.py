import os
import requests
from dotenv import load_dotenv
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)


BREVO_API_KEY = os.getenv("BREVO_API_KEY")
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")


def send_reset_email(receiver_email: str, reset_link: str):

    if not BREVO_API_KEY:
        raise Exception("BREVO_API_KEY is missing")

    if not EMAIL_ADDRESS:
        raise Exception("EMAIL_ADDRESS is missing")

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
    }

    data = {
        "sender": {
            "name": "CareerPilot AI",
            "email": EMAIL_ADDRESS,
        },
        "to": [
            {
                "email": receiver_email,
            }
        ],
        "subject": "CareerPilot AI - Reset Your Password",
        "htmlContent": f"""
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
        """,
    }

    try:

        response = requests.post(
            url,
            headers=headers,
            json=data,
            timeout=15,
        )

        print("BREVO RESPONSE:", response.status_code)
        print("BREVO RESPONSE BODY:", response.text)

        response.raise_for_status()

        print("BREVO EMAIL SENT SUCCESSFULLY")

        return response.json()

    except Exception as e:

        print("BREVO EMAIL ERROR:", str(e))

        raise