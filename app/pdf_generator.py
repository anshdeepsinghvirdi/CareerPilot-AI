from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4


def generate_pdf(analysis, filepath):

    # Make sure analysis is a dictionary
    if isinstance(analysis, str):
        import json

        try:
            analysis = json.loads(analysis)
        except json.JSONDecodeError:
            analysis = {}

    if not isinstance(analysis, dict):
        analysis = {}

    styles = getSampleStyleSheet()

    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )

    story = []

    # =========================
    # TITLE
    # =========================

    story.append(
        Paragraph(
            "CareerPilot AI Resume Analysis",
            styles["Title"]
        )
    )

    story.append(
        Spacer(1, 15)
    )

    story.append(
        Paragraph(
            "AI-Powered Resume & Career Report",
            styles["Heading3"]
        )
    )

    story.append(
        Spacer(1, 20)
    )

    # =========================
    # RESUME SCORE
    # =========================

    resume_score = analysis.get(
        "overall_score",
        analysis.get("resume_score", 0)
    )

    story.append(
        Paragraph(
            f"<b>Overall Resume Score:</b> {resume_score}%",
            styles["Heading2"]
        )
    )

    story.append(
        Spacer(1, 15)
    )

    # =========================
    # ATS BREAKDOWN
    # =========================

    breakdown = analysis.get("breakdown", {})

    if isinstance(breakdown, dict) and breakdown:

        story.append(
            Paragraph(
                "ATS & Resume Score Breakdown",
                styles["Heading2"]
            )
        )

        story.append(
            Spacer(1, 8)
        )

        breakdown_data = [
            ["Category", "Score"]
        ]

        category_names = {
            "keyword_match": "Keyword Match",
            "skills": "Skills",
            "projects": "Projects",
            "experience": "Experience",
            "education": "Education",
            "formatting": "Formatting",
            "grammar": "Grammar",
            "contact_information": "Contact Information",
        }

        for key, label in category_names.items():

            value = breakdown.get(key)

            if value is not None:

                breakdown_data.append(
                    [
                        label,
                        f"{value}%"
                    ]
                )

        if len(breakdown_data) > 1:

            table = Table(
                breakdown_data,
                colWidths=[350, 100]
            )

            table.setStyle(
                TableStyle(
                    [
                        (
                            "BACKGROUND",
                            (0, 0),
                            (-1, 0),
                            colors.HexColor("#2563eb"),
                        ),
                        (
                            "TEXTCOLOR",
                            (0, 0),
                            (-1, 0),
                            colors.white,
                        ),
                        (
                            "FONTNAME",
                            (0, 0),
                            (-1, 0),
                            "Helvetica-Bold",
                        ),
                        (
                            "GRID",
                            (0, 0),
                            (-1, -1),
                            0.5,
                            colors.grey,
                        ),
                        (
                            "PADDING",
                            (0, 0),
                            (-1, -1),
                            8,
                        ),
                    ]
                )
            )

            story.append(table)

            story.append(
                Spacer(1, 20)
            )

    # =========================
    # CAREER PROGRESS
    # =========================

    career_progress = analysis.get(
        "career_progress"
    )

    if career_progress is not None:

        story.append(
            Paragraph(
                "Career Progress",
                styles["Heading2"]
            )
        )

        story.append(
            Paragraph(
                f"<b>Career Progress:</b> {career_progress}%",
                styles["Normal"]
            )
        )

        story.append(
            Spacer(1, 15)
        )

    # =========================
    # HELPER FOR LIST SECTIONS
    # =========================

    def add_list_section(title, key):

        items = analysis.get(key, [])

        if not isinstance(items, list):
            return

        story.append(
            Paragraph(
                title,
                styles["Heading2"]
            )
        )

        story.append(
            Spacer(1, 5)
        )

        if not items:

            story.append(
                Paragraph(
                    "No information available.",
                    styles["Normal"]
                )
            )

        else:

            for item in items:

                story.append(
                    Paragraph(
                        f"• {item}",
                        styles["Normal"]
                    )
                )

        story.append(
            Spacer(1, 15)
        )

    # =========================
    # STRENGTHS
    # =========================

    add_list_section(
        "Strengths",
        "strengths"
    )

    # =========================
    # WEAKNESSES
    # =========================

    add_list_section(
        "Weaknesses",
        "weaknesses"
    )

    # =========================
    # MISSING SKILLS
    # =========================

    add_list_section(
        "Missing Skills",
        "missing_skills"
    )

    # =========================
    # RECOMMENDED JOBS
    # =========================

    add_list_section(
        "Recommended Jobs",
        "recommended_jobs"
    )

    # =========================
    # LEARNING ROADMAP
    # =========================

    add_list_section(
        "Learning Roadmap",
        "learning_roadmap"
    )

    # =========================
    # EXTRA DETAILS
    # =========================

    extra_sections = [
        ("Career Goal", "career_goal"),
        ("Summary", "summary"),
        ("Profile Summary", "profile_summary"),
    ]

    for heading, key in extra_sections:

        value = analysis.get(key)

        if value:

            story.append(
                Paragraph(
                    heading,
                    styles["Heading2"]
                )
            )

            story.append(
                Paragraph(
                    str(value),
                    styles["Normal"]
                )
            )

            story.append(
                Spacer(1, 15)
            )

    # =========================
    # FOOTER
    # =========================

    story.append(
        Spacer(1, 20)
    )

    story.append(
        Paragraph(
            "Generated by CareerPilot AI",
            styles["Normal"]
        )
    )

    story.append(
        Paragraph(
            "Your Intelligent Career Companion",
            styles["Normal"]
        )
    )

    # =========================
    # BUILD PDF
    # =========================

    doc.build(story)