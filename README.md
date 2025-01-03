# **Plagiarism Detection System**

This project is a web-based application designed to detect plagiarism in PDF files. It combines a **React.js frontend** with a **Django backend**, providing a seamless, accurate, and reliable solution for plagiarism detection. Users can upload PDFs, analyze content, and generate detailed reports.

---

## **Features**

### **Frontend (React.js):**
- User-friendly interface for uploading and managing PDF files.
- Real-time status updates during the analysis process.
- Responsive design for desktops, tablets, and mobile devices.

### **Backend (Django):**
- Robust PDF content processing.
- Web search integration using the **Serper API**.
- Comprehensive statistical analysis of content.
- Advanced plagiarism detection algorithms.
- Secure file handling and user data management.

### **Additional Features:**
- Detailed plagiarism reports highlighting matching sources.
- Multi-file upload support.
- Downloadable full reports in PDF format.

---

## **Technologies Used**

### **Frontend:**
- React.js
- React Router DOM
- Axios (for API calls)
- Tailwind CSS (for styling)

### **Backend:**
- Django
- Django REST Framework (DRF)
- **PDF Processing:** PyPDF2 or equivalent
- **Text Processing:** NLTK
- **Numerical Operations:** NumPy
- **Semantic Analysis:** Sentence Transformers ('all-MiniLM-L6-v2' model)
- **API Integration:** Requests and Serper API
- Text cleaning using **regex (re)**

---

## **Backend Architecture**

### **Multi-Agent System Components:**

1. **ReaderAgent:**
   - Extracts and processes text from PDFs.
   - Splits and cleans paragraphs.
   - Extracts metadata and handles HTML escape characters.

2. **SearchAgent:**
   - Performs web searches using the Serper API.
   - Extracts URLs and snippets for paragraphs.
   - Handles errors gracefully.

3. **TextStatisticsAgent:**
   - Counts words, characters, and syllables.
   - Analyzes paragraphs using NLTK for tokenization.

4. **PlagiarismCheckAgent:**
   - Integrates with a sentence transformer model.
   - Calculates **Jaccard similarity** and semantic similarity.
   - Highlights plagiarized content with:
     - **Yellow (40–70%)**
     - **Red (>70%)**

---

## **Project Directory Structure**

```
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── navigation
│   │   ├── styles
│   │   └── index.js
│   └── package.json
├── baseapp
│   ├── __pycache__
│   ├── migrations
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── plagiarismdetection
│   ├── __pycache__
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
├── manage.py
└── README.md
```

---

## **Screenshots**

### 1. **Upload PDF**
![Upload PDF](https://github.com/user-attachments/assets/ebfd3e88-5274-4713-8194-eeae33e2334f)
![Drag and Drop](https://github.com/user-attachments/assets/ae6cb593-5ea8-420e-9b22-d8ab28bf794f)
Description : A clean, minimalist web interface featuring a centered document icon at the top, followed by "PDF Document Analyzer" title and "Upload your PDF for instant analysis" subtitle. The main area displays a dashed-border rectangle for drag-and-drop functionality, complemented by a blue "Choose PDF" button. Below the upload area sits a full-width "Analyze Document" button in light gray, creating a simple and intuitive user flow.
### 2. **Processing Page**
![Processing](https://github.com/user-attachments/assets/1e47b8a6-d236-4f5d-ada6-1b106fb3892e)
Description : A simple loading indicator card showing a circular blue and gray spinner animation with the text "Analyzing your document..." below it, set against a white background with subtle shadow effects. The design suggests an active processing state while maintaining a clean, uncluttered appearance.
### 3. **Plagiarism Report**
![Plagiarism Report](https://github.com/user-attachments/assets/bdc4b5de-0cb6-4f79-83a7-a01bf3731115)
Description : A comprehensive analysis dashboard displaying a 48% plagiarism score in a circular progress indicator. The interface is divided into three main sections: document information (showing details like word count, characters, and syllables), analysis results with similarity scores, and a text preview section highlighting potentially plagiarized content in red and yellow. The interface includes action buttons for "Try Another File" and "Download Report" in the top right corner.   
---

## **Getting Started**

### **Prerequisites**
Ensure you have the following installed:
- Node.js and npm
- Python 3.x
- Django and related dependencies

### **Installation**

#### Clone the Repository:
```bash
git clone https://github.com/yourusername/plagiarism-detection.git
cd plagiarism-detection
```

#### Frontend Setup:
```bash
cd frontend
npm install
npm start
```

#### Backend Setup:
```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## **Usage**

1. Start both the backend and frontend servers.
2. Navigate to `http://localhost:3000`.
3. Upload a PDF and analyze for plagiarism.
4. View and download the report.

---

## **Contributing**

We welcome contributions! Follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make changes and commit: `git commit -m 'Add feature'`.
4. Push to your branch: `git push origin feature-name`.
5. Open a pull request.

---

## **License**

Licensed under the **MIT License**. See the `LICENSE` file for details.

---

## **Contact**

Feel free to reach out for questions or feedback:
- **Email:** [ourtanane.ali@gmail.com](mailto:ourtanane.ali@gmail.com), [anouzlay@gmail.com](mailto:anouzlay@gmail.com)
- **GitHub:** [Ourtanane77](https://github.com/Ourtanane77), [Anouzlay](https://github.com/Anouzlay)
