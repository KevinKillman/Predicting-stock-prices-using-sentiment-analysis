import os
from dotenv import load_dotenv
import pandas as pd
import yfinance as yf
import requests
from alpha_vantage.timeseries import TimeSeries
import json
import datetime as dt

load_dotenv()

def VWAP_data_requests(ticker, interval):
    key = os.environ.get('alpha_VANTAGE_API')
    json = requests.get(f'https://www.alphavantage.co/query?function=VWAP&symbol={ticker}&interval={interval}&outputsize=full&apikey={key}').json()
    stock_df = pd.DataFrame(json['Technical Analysis: VWAP'])
    stock_df = stock_df.transpose()
    json2 = requests.get(f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AMC&interval=1min&outputsize=full&apikey={key}').json()
    time_df = pd.DataFrame(json2['Time Series (1min)']).transpose()
    temp_list = []
    for x in stock_df['VWAP']:
        temp_list.append(x)
    time_df['VWAP'] = temp_list
    time_df = time_df.reset_index()
    time_df = time_df.rename(columns={'index':'date'})
    time_df.columns = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume',
        'VWAP']
    time_df['Date'] = pd.to_datetime(time_df['Date'])
    data = time_df.loc[time_df['Date']>dt.datetime.strptime('2021-02-04', '%Y-%m-%d')]
    return data.to_json(orient='records', date_format='iso')

