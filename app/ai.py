import json

from groq import Groq
from .config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


def analyze_resume(resume_text: str):
    prompt = f"""
You are an expert ATS Resume Analyzer and Career Coach.

Analyze the resume carefully.

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
        "Strong Python skills",
        "Good AI projects"
    ],

    "weaknesses": [
        "Limited professional experience",
        "Few advanced projects"
    ],

    "missing_skills": [
        "Docker",
        "AWS",
        "SQL"
    ],

    "recommended_jobs": [
        "AI Engineer",
        "Machine Learning Engineer"
    ],

    "learning_roadmap": [
        "Learn SQL",
        "Learn Docker",
        "Build ML Projects"
    ]
}}

IMPORTANT:

- overall_score must be between 0 and 100.
- career_progress must be between 0 and 100.
- career_progress represents how close the candidate currently is to their career potential based ONLY on the resume.
- Consider education, technical skills, projects, experience, certifications and career relevance.
- Do NOT use a fixed value.
- Different resumes should receive different scores.
- Do NOT return null.
- Do NOT return "Career_progress".
- Use exactly "career_progress".

Resume:

{resume_text}
"""

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert ATS resume analyzer and career coach. Always return valid JSON."
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

        print("AI CAREER PROGRESS:", analysis.get("career_progress"))
        print("AI OVERALL SCORE:", analysis.get("overall_score"))

        if not isinstance(analysis, dict):
            raise ValueError("AI returned invalid analysis")

        if "overall_score" not in analysis:
            raise ValueError("overall_score missing")

        if "career_progress" not in analysis:
            raise ValueError("career_progress missing")

        return analysis

    except Exception as e:
        print("Resume AI Analysis Error:", e)
        return None


def generate_career_roadmap(skills: str, career_goal: str):
    prompt = f"""
You are an expert Career Mentor and Career Roadmap Designer.

Student Skills:
{skills}

Career Goal:
{career_goal}

Create a COMPLETE, personalized career roadmap for this student.

The roadmap must cover the student's journey from their current level
all the way to being job-ready for their target career.

Return ONLY valid JSON.

Use EXACTLY this structure:

{{
    "current_level": "Beginner",
    "stages": [
        {{
            "title": "Stage title"
        }},
        {{
            "title": "Stage title"
        }}
    ]
}}

IMPORTANT RULES:

1. Create EXACTLY 10 stages.
2. The 10 stages must form a complete learning and career journey.
3. Do NOT stop after 4 stages.
4. Do NOT generate fewer than 10 stages.
5. Do NOT generate more than 10 stages.
6. Stages must be based on the student's actual skills and career goal.
7. Do NOT always use Python, Machine Learning, Deep Learning, or AI Engineering.
8. If the career goal is Web Developer, create a complete web development roadmap.
9. If the career goal is Data Scientist, create a complete data science roadmap.
10. If the career goal is AI Engineer, create a complete AI engineering roadmap.
11. Adapt the roadmap to other career goals as well.
12. Early stages should cover fundamentals and skills the student needs.
13. Middle stages should progressively build advanced technical skills.
14. Include practical projects at appropriate stages.
15. Include real-world development, deployment, tools, or industry skills when relevant.
16. Include portfolio/resume preparation when appropriate.
17. The final stages should prepare the student for internships/jobs/interviews.
18. The roadmap must progress logically from beginner/current level to job-ready level.
19. Do NOT mark stages as completed, current, or upcoming.
20. Return ONLY the stage titles.
21. Keep stage titles short, preferably 2-6 words.
22. Every stage must be meaningfully different.
23. Do not repeat the same skill in multiple stages.
24. Return valid JSON only.
25. Do not use markdown.
"""

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert career roadmap designer. Always return valid JSON."
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
                f"AI returned {len(roadmap['stages'])} stages instead of 10"
            )

        return roadmap

    except Exception as e:
        print("Career Roadmap AI Error:", e)
        return None

def generate_job_recommendations(skills: str, career_goal: str):
    prompt = f"""
You are an expert AI Career Advisor.

Student Skills:
{skills}

Career Goal:
{career_goal}

Recommend the best 5 job roles.

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
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Groq Error: {e}"


def generate_interview_question(role: str):

    prompt = f"""
You are an expert interviewer.

Generate ONE interview question for a {role}.str

only return the question.
"""

    try: 

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Groq Error: {e}"


def evaluate_answer(role: str, question: str, answer: str):
    prompt = f"""
You are an expert interviewer.

Role:
{role}

Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer.

Return in this format:

Score: __/10

Strengths:
- ...

Weaknesses:
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
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Groq Error: {e}"