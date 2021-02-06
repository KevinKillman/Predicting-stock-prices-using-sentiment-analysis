import os
from dotenv import load_dotenv
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
load_dotenv()

x = os.getenv('twitter_KEY')
print(f'{x}')