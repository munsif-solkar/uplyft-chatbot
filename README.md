# uplyft-chatbot
An interactive chatbot that allows users to search, explore, and purchase products on an e-commerce platform.
## Tech Stack
- Frontend: HTML, TailwindCSS, jQuery
- Backend: Flask (Python)
- Database: SQLite3
- Session: Flask Session

## Features
- User Login & Authentication
- Responsive Chatbot Interface
- Product Search with Buy Now flow
- Multi-step order process (Address → Payment → Confirm)
- Persistent chat session using localStorage
- Chat timestamps
- Clear Chat button

## How to Run
1. Clone repo
2. Install Python dependencies: `pip install flask`
3. Run app: `python app.py`
4. Access at: `http://127.0.0.1:5000`

## Future Improvements
- Save chat history
- Implement user registration flow

## Challenges Faced
- Managing chatbot state across multi-step order flow
- Keeping UI simple and mobile-friendly
- Implementing session continuity

---
