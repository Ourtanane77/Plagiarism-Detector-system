import requests

url = 'http://localhost:8000/api/plagiarism-detection/'
file_path = '1.pdf'

with open(file_path, 'rb') as f:
    files = {'file': f}
    response = requests.post(url, files=files)

print('Status Code:', response.status_code)
print('Response JSON:', response.json())