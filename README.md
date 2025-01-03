# Plagiarism Detection System

This project is a web-based application designed to detect plagiarism in PDF files. The system is built with a React.js frontend and a Django backend, leveraging powerful tools to provide accurate and reliable plagiarism detection. The app supports uploading PDF files, analyzing their content, and providing detailed reports.

## Features

### Frontend (React.js):
- User-friendly interface for uploading and managing PDF files.
- Real-time status updates during the analysis process.
- Responsive design for seamless use on desktops, tablets, and mobile devices.

### Backend (Django):
- Robust processing of PDF content.
- Integration of web search using the Serper API.
- Perform a comprehensive statistical analysis of PDF content.
- Advanced plagiarism detection algorithms.
- Secure handling of files and user information.

### Additional Features:
- Detailed plagiarism reports highlighting matching sources.
- Support for multiple PDF file uploads.
- Download a full report as PDF file.
---

## Technologies Used

### Frontend:
- React.js
- React router dom
- Axios (for API calls)
- Tailwind CSS for styling

### Backend:
- Django
- Django Rest Framework (DRF) for API development
- PyPDF2 or a similar library for PDF parsing
- NLTK (for text processing)
- NumPy (for numerical operations)
- sentence-transformers (for text embeddings)
- requests (for API calls)
- re (for text cleaning)
- Serper API for web search (key required)
- Sentence Transformer: 'all-MiniLM-L6-v2' model

---

## Backend Architecture

#### Multi-Agent System Components:

1. **ReaderAgent**
   - PDF processing and text extraction
   - Paragraph splitting and cleaning
   - Metadata extraction
   - HTML escape handling

2. **SearchAgent**
   - Web search integration via Serper API
   - URL and snippet extraction for each paragraph
   - Error handling for failed searches

3. **TextStatisticsAgent**
   - Word, character, syllable counting
   - Paragraph analysis
   - NLTK integration for tokenization

4. **PlagiarismCheckAgent**
   - Sentence transformer model integration
   - Jaccard similarity calculation
   - Semantic similarity via embeddings
   - Color-coded plagiarism detection (yellow: 40-70%, red: >70%)


## Project Directory Structure

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
├── backend
│   ├── plagiarismdetection
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── api
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
└── README.md
```


#### Key Dependencies:
```python
- PyPDF2==3.0.1
- nltk==3.8.1
- sentence-transformers==2.2.2
- numpy==1.24.3
## Screenshots

### 1. Upload PDF
![image](https://github.com/user-attachments/assets/ebfd3e88-5274-4713-8194-eeae33e2334f)
![image](https://github.com/user-attachments/assets/ae6cb593-5ea8-420e-9b22-d8ab28bf794f)

- **Upload Interface**: Allows users to select and upload a PDF file for plagiarism analysis.
- **Drag-and-Drop Feature**: Users can easily drag and drop files into the upload area.
- **File Validation**: Ensures only valid PDF files are accepted before proceeding to the next step.

### 2. Processing Page
![image](https://github.com/user-attachments/assets/1e47b8a6-d236-4f5d-ada6-1b106fb3892e)

- **Visual Progress Indicator**: Displays the current status of the plagiarism detection process, ensuring users are informed in real-time.
- **Estimated Time**: Provides an approximate duration for the analysis to complete.
- **Loading Animation**: Includes a dynamic visual element to indicate the application is actively processing the uploaded PDF file.

### 3. Plagiarism Report
![image](https://github.com/user-attachments/assets/bdc4b5de-0cb6-4f79-83a7-a01bf3731115)

- **Highlighted Text**: Sections of the PDF with detected plagiarism are highlighted. Users can click on these highlighted sections to view the corresponding source links or additional details.
- **Score and Metadata**: Displayed at the top of the report, showing the percentage of detected plagiarism and detailed metadata such as word count and analysis time.
- **Source Links**: Clickable links that redirect to the original sources of the matching content, allowing users to verify and review the similarities.
- **Highlighted Text**: Sections of the PDF with detected plagiarism are highlighted.
- **Score and Metadata**: Displayed at the top of the report.
- **Source Links**: Links to sources for matching content.
- **You can get result as pdf**

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js and npm
- Python 3.x
- Django
- PyPDF2
- nltk
- sentence-transformers
- numpy
- Django rest_framework 

### Installation

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
1. install requirements
```bash
cd backend
python -m venv env
source env/bin/activate # On Windows, use `env\Scripts\activate`
pip install -r requirements.txt or using
```bash
pip install django
pip install PyPDF2
pip install nltk
pip install sentence-transformers
pip install numpy
pip install djangorestframework
pip install numpy
pip install requests
````
python manage.py migrate
python manage.py runserver
```


## Usage

1. Launch the backend server and the frontend application.
2. Navigate to `http://localhost:3000` to access the application.
3. Upload a PDF file and wait for the analysis to complete.
4. View the plagiarism report.


## Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit them (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.


## License

This project is licensed under the MIT License. See the `LICENSE` file for details.


## Contact

For questions or feedback, feel free to reach out:
- Email: ourtanane.ali@gmail.com , anouzlay@gmail.com 
- GitHub: [Ourtanane77](https://github.com/Ourtanane77) , [Anouzlay](https://github.com/Anouzlay)
