python -m venv .\venv

.\venv\Scripts\activate  

cd .\crimereportscraper\ 

pip install scrapy 

scrapy crawl crimereport -O crimedata.json 