import json

from groq import Groq
from .config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


# =========================================================
# RESUME ANALYSIS
# =========================================================

def analyze_resume(resume_text: str):

    prompt = f"""
You are an expert ATS Resume Analyzer and Universal Career Coach.

Analyze the candidate's resume carefully.

The candidate may belong to ANY profession or industry, including but not limited to:

- Software and IT
- Artificial Intelligence
- Electrical Engineering
- Mechanical Engineering
- Civil Engineering
- Chemical Engineering
- Electronics Engineering
- Healthcare
- Pharmacy
- Business and Management
- Finance and Accounting
- Marketing and Sales
- Design
- Education
- Law
- Science and Research
- Manufacturing
- Other professional fields

IMPORTANT:
Never assume that every candidate is an AI Engineer,
Software Engineer, Python Developer, or Data Scientist.

Identify the candidate's actual:

- Education
- Branch or field
- Skills
- Projects
- Experience
- Certifications
- Career direction

Then evaluate the resume according to the candidate's
OWN profession and career background.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside JSON.

Use EXACTLY this structure:

{{
    "overall_score": 85,
    "career_progress": 65,

    "breakdown": {{
        "keyword_match": 18,
        "skills": 17,
        "projects": 14,
        "experience": 15,
        "education": 10,
        "formatting": 8,
        "grammar": 8,
        "contact_information": 5
    }},

    "strengths": [
        "Relevant professional strength"
    ],

    "weaknesses": [
        "Area that needs improvement"
    ],

    "missing_skills": [
        "Skill relevant to the candidate's profession"
    ],

    "recommended_jobs": [
        "Job relevant to the candidate's education and skills"
    ],

    "learning_roadmap": [
        "Career-relevant learning step"
    ]
}}

IMPORTANT RULES:

- overall_score must be between 0 and 100.
- career_progress must be between 0 and 100.
- career_progress represents how close the candidate currently is
  to being job-ready in their most suitable career direction.
- Consider education, skills, projects, experience,
  certifications and career relevance.
- Do NOT use a fixed value.
- Different resumes should receive different scores.
- Do NOT return null.
- Do NOT return "Career_progress".
- Use exactly "career_progress".
- Recommend jobs based on the actual candidate profile.
- Do NOT recommend technical or AI jobs unless the resume supports them.
- Missing skills must be relevant to the candidate's profession.
- Learning roadmap must match the candidate's actual career field.
- Return exactly 5 recommended jobs when possible.
- Return practical and realistic career suggestions.

Resume:

{resume_text}
"""

    try:

        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert universal ATS resume analyzer "
                        "and career coach. You can analyze resumes from "
                        "any professional field. Always return valid JSON."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
        )

        result = completion.choices[0].message.content.strip()

        if result.startswith("```"):
            result = result.replace("```json", "")
            result = result.replace("```", "")
            result = result.strip()

        analysis = json.loads(result)

        print(
            "AI CAREER PROGRESS:",
            analysis.get("career_progress")
        )

        print(
            "AI OVERALL SCORE:",
            analysis.get("overall_score")
        )

        if not isinstance(analysis, dict):
            raise ValueError(
                "AI returned invalid analysis"
            )

        if "overall_score" not in analysis:
            raise ValueError(
                "overall_score missing"
            )

        if "career_progress" not in analysis:
            raise ValueError(
                "career_progress missing"
            )

        return analysis

    except Exception as e:

        print(
            "Resume AI Analysis Error:",
            e
        )

        return None


# =========================================================
# CAREER ROADMAP
# =========================================================

def generate_career_roadmap(skills: str, career_goal: str):

    prompt = f"""
You are an expert Universal Career Mentor and Career Roadmap Designer.

You create personalized career roadmaps for ANY profession or industry.

Student Skills:
{skills}

Target Career Goal:
{career_goal}

Create a COMPLETE personalized career roadmap specifically for
the student's TARGET CAREER GOAL.

IMPORTANT:

Never assume the student wants to become an AI Engineer,
Machine Learning Engineer, Python Developer, Data Scientist,
or Software Engineer.

Only include those subjects if they are genuinely relevant
to the student's selected career goal.

The roadmap must adapt to ANY profession.

Examples:

If the career goal is Electrical Engineer, focus on relevant topics
such as electrical fundamentals, circuit analysis, electrical machines,
power systems, protection, PLC, automation, simulation tools and
industry skills where appropriate.

If the career goal is Mechanical Engineer, focus on relevant topics
such as engineering mechanics, CAD, thermodynamics, manufacturing,
machine design, simulation tools and industry practices.

If the career goal is Civil Engineer, focus on relevant topics
such as structural engineering, construction practices, AutoCAD,
estimation, surveying and industry tools.

If the career goal is Marketing Manager, focus on marketing,
consumer behavior, digital marketing, analytics, campaigns and
professional portfolio development.

Adapt intelligently to every other profession as well.

Return ONLY valid JSON.

Use EXACTLY this structure:

{{
    "current_level": "Beginner",
    "stages": [
        {{
            "title": "Stage title"
        }}
    ]
}}

IMPORTANT RULES:

1. Create EXACTLY 10 stages.
2. The 10 stages must form a complete career journey.
3. The roadmap must be specifically related to:
   "{career_goal}"
4. Use the student's existing skills when deciding the starting level.
5. Start with missing fundamentals where necessary.
6. Progress logically from beginner/current level to job-ready.
7. Do NOT automatically include Python, AI, Machine Learning,
   Deep Learning, or software development.
8. Include those topics ONLY if relevant to the career goal.
9. Include practical projects, labs, case studies, designs,
   field work or portfolio work where relevant to the profession.
10. Include industry-standard tools where relevant.
11. Include professional skills required for that career.
12. Include resume/portfolio preparation where relevant.
13. Include internship/job preparation.
14. Include interview preparation near the final stages.
15. Do NOT mark stages as completed, current, or upcoming.
16. Return ONLY stage titles.
17. Keep every stage title short, preferably 2-6 words.
18. Every stage must be meaningfully different.
19. Do not repeat the same skill unnecessarily.
20. Return valid JSON only.
21. Do not use markdown.
"""

    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert universal career roadmap "
                        "designer. You create personalized roadmaps "
                        "for every profession and industry. Always "
                        "return valid JSON."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.4
        )

        result = response.choices[0].message.content.strip()

        if result.startswith("```"):
            result = result.replace("```json", "")
            result = result.replace("```", "")
            result = result.strip()

        roadmap = json.loads(result)

        if not isinstance(roadmap, dict):
            raise ValueError("AI returned invalid roadmap")

        if "stages" not in roadmap:
            raise ValueError("Roadmap stages missing")

        if len(roadmap["stages"]) != 10:
            raise ValueError(
                f"AI returned {len(roadmap['stages'])} "
                f"stages instead of 10"
            )

        return roadmap

    except Exception as e:

        print("Career Roadmap AI Error:", e)

        return None

# =========================================================
# JOB RECOMMENDATIONS
# =========================================================

def generate_job_recommendations(
    skills: str,
    career_goal: str
):

    prompt = f"""
You are an expert Universal Career Advisor.

Student Skills:
{skills}

Career Goal:
{career_goal}

Recommend the 5 most suitable job roles.

IMPORTANT:

The student may belong to ANY professional field.

Do NOT assume the student belongs to IT,
Artificial Intelligence or Software Engineering.

The recommended jobs must be relevant to:

- The student's listed skills
- Their career goal
- Their likely professional field

For example:

Electrical careers should receive electrical,
automation, power, electronics or relevant roles.

Mechanical careers should receive mechanical,
design, manufacturing, automotive or relevant roles.

Civil careers should receive construction,
structural, site or relevant roles.

Business careers should receive management,
marketing, sales, operations or relevant roles.

Recommend only realistic career roles.

For each role provide:

Job Role:
Reason:
Required Skills:
Expected Salary (India):

Keep the answer under 500 words.

Return only the final answer.
"""

    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert universal career advisor "
                        "who recommends jobs across all industries."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return (
            response
            .choices[0]
            .message
            .content
        )

    except Exception as e:

        return f"Groq Error: {e}"


# =========================================================
# MOCK INTERVIEW QUESTION
# =========================================================

def generate_interview_question(role: str):

    prompt = f"""
You are an expert interviewer for ANY profession.

Candidate's target role:
{role}

Generate ONE realistic interview question specifically related
to this role.

IMPORTANT:
- Adapt completely to the selected profession.
- Do NOT assume the role is related to AI or programming.
- Test role-specific knowledge, practical skills, problem-solving,
  or real-world situations.
- Return ONLY the interview question.
"""

    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert interviewer for all professions."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"Groq Error: {e}"


# =========================================================
# INTERVIEW ANSWER EVALUATION
# =========================================================

def evaluate_answer(role: str, question: str, answer: str):

    prompt = f"""
You are an expert interviewer for ANY profession.

Target Role:
{role}

Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer specifically according to the requirements
of the selected role.

Do NOT assume every role is technical.

Return exactly:

Score: __/10

Strengths:
- ...

Areas to Improve:
- ...

Better Answer:
...

Next Question:
...
"""

    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": "You evaluate interview answers for all professions."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"Groq Error: {e}"