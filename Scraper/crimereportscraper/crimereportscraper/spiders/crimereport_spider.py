import scrapy
import scrapy.selector

class CrimeReportSpider(scrapy.Spider):
    name = 'crimereport'
    
    start_urls = [
        'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=1',
        'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=2',
        'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=3',
        'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=4',
        'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=5',
        'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=6',
        'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=7',
        'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=8',
        'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=9',
        # 'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=10',
        # 'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=11',
        # 'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=12',
        # 'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=13',
        # 'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=14',
        # 'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=15',
        # 'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=16',
        # 'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=17',
        # 'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=18',
        # 'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=19',
        # 'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d&page=20',
    ]

    def parse(self, response):
        
        products = response.css('div.newsItem')
        info = products.css('div.newsItem_Content').extract()
        yield {'infotext': info}