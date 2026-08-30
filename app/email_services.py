import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)


EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")

EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

print("ENV FILE:", ENV_FILE)
print("ENV EXISTS:", ENV_FILE.exists())
print("EMAIL_ADDRESS:", EMAIL_ADDRESS)
print("EMAIL_PASSWORD EXISTS:", bool(EMAIL_PASSWORD))


def send_reset_email(receiver_email: str, reset_link: str):

    if not EMAIL_ADDRESS:
        raise Exception("EMAIL_ADDRESS is missing from .env")

    if not EMAIL_PASSWORD:
        raise Exception("EMAIL_PASSWORD is missing from .env")

    msg = EmailMessage()

    msg["Subject"] = "CareerPilot AI - Reset Your Password"
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = receiver_email

    msg.set_content(
        f"""
Hello,

Your CareerPilot AI password reset link is here:

{reset_link}

This link is valid for 15 minutes.

If you did not request this password reset,
please ignore this email.

Regards,
CareerPilot AI Team
"""
    )

    try:

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:

            smtp.login(
                EMAIL_ADDRESS,
                EMAIL_PASSWORD
            )

            smtp.send_message(msg)

        print(f"Reset email sent successfully to {receiver_email}")

    except Exception as e:

        print("EMAIL ERROR:", str(e))

        raise
