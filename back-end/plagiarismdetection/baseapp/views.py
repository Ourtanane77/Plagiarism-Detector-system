from PyPDF2 import PdfReader
import nltk
import numpy as np
from sentence_transformers import SentenceTransformer
import requests
from rest_framework.parsers import MultiPartParser
import re
from rest_framework.views import APIView
from rest_framework.response import Response
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('wordnet')
nltk.download('omw-1.4')

class ReaderAgent:
    def process(self, file):
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()

        text = self._clean_text(text)
        sentences = nltk.sent_tokenize(text)
        paragraphs = self._split_into_paragraphs(text)
        paragraphs = [f"{self._escape_html(para)}" for para in paragraphs]
        metadata = reader.metadata
        doc_metadata = {
            "title": metadata.title if metadata and metadata.title else "Unknown",
            "author": metadata.author if metadata and metadata.author else "Unknown",
            "subject": metadata.subject if metadata and metadata.subject else "None",
            "keywords": metadata.get('/Keywords', 'None') if metadata else "None"
        }

        return sentences, text, paragraphs, doc_metadata

    def _clean_text(self, text):
        text = re.sub(r'\s+', ' ', text)
        text = text.replace('\ufeff', '')
        return text.strip()

    def _split_into_paragraphs(self, text):
        paragraphs = re.split(r'\n\s*\n', text)
        if len(paragraphs) <= 1:
            sentences = nltk.sent_tokenize(text)
            paragraphs = [' '.join(sentences[i:i + 3]) for i in range(0, len(sentences), 3)]
        return [para.strip() for para in paragraphs if para.strip()]

    def _escape_html(self, text):
        html_escape_table = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }
        return "".join(html_escape_table.get(c, c) for c in text)


class SearchAgent:
    def process(self, sentences):
        api_key = "440e3ab95678c4b30f3fdd8aa079b1a0c845a316"
        url = "https://google.serper.dev/search"
        headers = {"X-API-KEY": api_key}
        results = []

        for sentence in sentences:
            params = {"q": sentence}
            try:
                response = requests.post(url, headers=headers, json=params)
                response.raise_for_status()
                data = response.json()
                organic_results = data.get("organic", [])
                if organic_results:
                    most_relevant_url = organic_results[0].get("link", None)
                    snippet = organic_results[0].get("snippet", None)
                    results.append({"sentence": sentence, "url": most_relevant_url, "snippet": snippet})
                else:
                    results.append({"sentence": sentence, "url": None, "snippet": None})
            except requests.exceptions.RequestException:
                results.append({"sentence": sentence, "url": None, "snippet": None})
        return results, len(results)


class TextStatisticsAgent:
    def calculate_statistics(self, text, paragraphs):
        words = nltk.word_tokenize(text)
        characters = len(text)
        syllables = sum(self.count_syllables(word) for word in words)
        return {
            "words": len(words),
            "characters": characters,
            "syllables": syllables,
            "paragraphs": len(paragraphs)
        }

    def count_syllables(self, word):
        vowels = "aeiouy"
        word = word.lower()
        syllable_count = 0
        if word[0] in vowels:
            syllable_count += 1
        for i in range(1, len(word)):
            if word[i] in vowels and word[i - 1] not in vowels:
                syllable_count += 1
        if word.endswith("e"):
            syllable_count -= 1
        return max(syllable_count, 1)


class PlagiarismCheckAgent:
    def __init__(self, model):
        self.model = model

    def jaccard_similarity(self, sent1, sent2):
        set1 = set(sent1.split())
        set2 = set(sent2.split())
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        return intersection / union if union != 0 else 0

    def get_model_plagiarism_score(self, text1, text2):
        embedding1 = self.model.encode(text1)
        embedding2 = self.model.encode(text2)
        similarity = np.dot(embedding1, embedding2.T) / (
            np.linalg.norm(embedding1) * np.linalg.norm(embedding2)
        )
        return similarity

    def get_plagiarized_sections(self, paragraph, snippet, threshold=0.4):
        paragraph_sentences = nltk.sent_tokenize(paragraph)
        highest_match = None

        paragraph_embeddings = self.model.encode(paragraph_sentences)
        snippet_embedding = self.model.encode([snippet])[0]

        for i, emb in enumerate(paragraph_embeddings):
            cosine_similarity = np.dot(emb, snippet_embedding.T) / (
                np.linalg.norm(emb) * np.linalg.norm(snippet_embedding)
            )

            if cosine_similarity > threshold:
                color = "yellow" if 0.4 <= cosine_similarity < 0.7 else "red"
                if highest_match is None or cosine_similarity > highest_match["similarity"]:
                    highest_match = {
                        "Paragraphe_pdf_Content": paragraph_sentences[i],
                        "section_snippet_search": snippet,
                        "similarity": cosine_similarity,
                        "color": color
                    }

        return [highest_match] if highest_match else []

    def process(self, paragraph, search_results):
        plagiarism_results = []

        for result in search_results:
            snippet = result['snippet']
            url = result['url']

            plagiarized_sections = self.get_plagiarized_sections(paragraph, snippet)

            jaccard_score = self.jaccard_similarity(paragraph, snippet)
            model_score = self.get_model_plagiarism_score(paragraph, snippet)
            overall_score = (jaccard_score * 0.2 + model_score * 0.8)

            plagiarism_results.append({
                "paragraph_content": paragraph,
                "snippet_content": snippet,
                "url": url,
                "jaccard_score": jaccard_score,
                "model_score": model_score,
                "overall_score": overall_score,
                "plagiarized_sections_in_both": plagiarized_sections
            })

        return plagiarism_results


class PlagiarismDetectionAPIView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        # Handle file upload
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response({"error": "No file uploaded."}, status=400)

        # Initialize model and agents
        model = SentenceTransformer('all-MiniLM-L6-v2')
        reader_agent = ReaderAgent()
        search_agent = SearchAgent()
        text_statistics_agent = TextStatisticsAgent()
        plagiarism_check_agent = PlagiarismCheckAgent(model)

        # Process the uploaded file
        sentences, text, paragraphs, doc_metadata = reader_agent.process(uploaded_file)

        # Process search results
        search_results, total_sources = search_agent.process(paragraphs)

        # Calculate text statistics
        stats = text_statistics_agent.calculate_statistics(text, paragraphs)

        # Perform plagiarism check
        all_plagiarism_results = []
        overal_plagiarism=[]
        sum_jaccard=0
        sum_model = 0
        for idx, paragraph in enumerate(paragraphs):
            paragraph_search_results = [
                result for result in search_results if result['sentence'] == paragraph
            ]

            plagiarized_sections = plagiarism_check_agent.process(paragraph, paragraph_search_results)

            all_plagiarism_results.append({
                "paragraph_index": idx,
                "paragraph_content": paragraph,
                "results": plagiarized_sections
            
            })
            sum_jaccard= sum_jaccard + plagiarized_sections[0]['jaccard_score'] 
            sum_model = sum_model +  plagiarized_sections[0]['model_score']

        model_score =sum_model / len(paragraphs)
        jaccard_score = sum_jaccard / len(paragraphs)
        overal_plagiat_score_pdf = model_score * 0.8 + jaccard_score * 0.2
        overal_unique_score_pdf = 1 - overal_plagiat_score_pdf
        overal_plagiarism = {
                "jaccard_score" : jaccard_score ,
                "model_score" :model_score ,
                "overal_score_pdf" : model_score * 0.8 + jaccard_score * 0.2 ,
                "overal_unique_score_pdf" : overal_unique_score_pdf

            }
        # Generate output
        generate_output = {
            "metadata": doc_metadata,
            "statistics": stats,
            "plagiarism_results": all_plagiarism_results,
            "total_sources_found": total_sources ,
            "overal" : overal_plagiarism 
        }

        # Return the response
        # return Response(generate_output)
        return Response(data=generate_output, status=200, content_type="application/json")
