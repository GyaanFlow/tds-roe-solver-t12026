// Bypass: Video Attendee Extraction (weight=0.5)
export const id = 'q-video-attendee-server';
export const title = 'Video Attendee Extraction (Gemini)';

export function solve(email) {
  return {
    variant: 'Requires Gemini API to extract names from video',
    type: 'bypass',
    answer: `// 🔥 GUIDE: Video Attendee Extraction (0.5 marks)
//
// FULL PYTHON SOLUTION:
// ======================
// pip install google-genai
//
// === main.py ===
// import google.generativeai as genai
// import json, sys, time
//
// genai.configure(api_key="YOUR_GEMINI_API_KEY")
//
// video_path = sys.argv[1] if len(sys.argv) > 1 else "attendee_checkin.webm"
//
// # Upload video
// print("Uploading video...")
// video = genai.upload_file(video_path, mime_type="video/webm")
//
// # Wait for processing
// while video.state.name == "PROCESSING":
//     time.sleep(2)
//     video = genai.get_file(video.name)
//
// print("Processing complete, extracting attendees...")
//
// model = genai.GenerativeModel("gemini-2.0-flash")
// response = model.generate_content([
//     video,
//     """Extract ALL 20 attendee check-in entries from this video.
//     Each entry has a name and a date in DD/MM/YYYY format.
//     Return ONLY a JSON array: [{"name": "Full Name", "date": "DD/MM/YYYY"}, ...]
//     Include exactly 20 entries. Be precise with dates and names."""
// ])
//
// # Parse and print
// text = response.text
// # Extract JSON from response
// import re
// json_match = re.search(r'\\[.*?\\]', text, re.DOTALL)
// if json_match:
//     attendees = json.loads(json_match.group())
//     print(json.dumps(attendees, indent=2))
//     print(f"\\nExtracted {len(attendees)} attendees")
// else:
//     print("Raw response:", text)
//
// STEPS:
// 1. Download your unique video from the exam page
// 2. Set GEMINI_API_KEY environment variable
// 3. Run: python main.py attendee_checkin.webm
// 4. Paste the JSON array output
// 5. Need ≥15/20 correct for acceptance`,
    answerDisplay: '<strong>Strategy:</strong> Download video → Upload to Gemini API → Extract 20 name/date pairs → Submit JSON array. Need ≥15/20 correct.'
  };
}
