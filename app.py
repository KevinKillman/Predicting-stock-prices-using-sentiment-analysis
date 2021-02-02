from flask import Flask, jsonify, render_template                     #imports Flask CLASS and jsonify funct
from flask_cors import CORS
import yfinance as yf
import os
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import time
from sqlalchemy import create_engine, inspect
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

#from config import sql_PASS, sql_USER, sql_HOST

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL','')  #or f"postgres://{sql_USER}:{sql_PASS}@{sql_HOST}:5432/stockDashboard_db"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

engine = db.engine

def infoQuery(ticker):
    return yf.Ticker(ticker).info

def queryAPIperiod(ticker, period='ytd', interval='1d'):
    stock_df = yf.Ticker(ticker).history(period=period, interval=interval)
    stock_df.dropna(inplace=True)
    stock_df.reset_index(inplace=True)
    return stock_df.to_json(orient='records', date_format='iso')
                   
def queryAPIstartEnd(ticker, s='1986-03-13', e='2020-12-14'):

    return yf.Ticker(ticker).history(start=s, end=e).reset_index(inplace=True).to_json(orient='records', date_format='iso')

# def exceptionDF():
#     tickers = ['AAPL', 'GME', 'AMC', 'MSFT']
#     ticker_obj = yf.Tickers(tickers=tickers)
#     full_df = pd.DataFrame(columns=['Ticker', 'Open', 'High', 'Low', 'Close', 'Volume', 'Dividends','Stock Splits'])
#     for x in tickers:
#         info = yf.Ticker(x)
#         temp_df = info.history(period=)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/machine_learning')
def machine_learning():
    return render_template('machine_learning.html')

@app.route('/ticker=<string:ticker>')             
def tickerRoute(ticker):
    return queryAPIperiod(ticker)

@app.route('/ticker=<string:ticker>/period=<string:period>')             
def periodRoute(ticker, period):
    if period =="2y" or period =="5y" or period =="10y":
        interval = '1wk'
    else:
        interval = '1d'
    return queryAPIperiod(ticker, period=period, interval=interval)

@app.route('/ticker=<string:ticker>/period=<string:period>/interval=<string:interval>')             
def periodIntervalRoute(ticker, period, interval):
    return queryAPIperiod(ticker, period=period, interval=interval)
    
@app.route('/ticker=<string:ticker>/start=<string:start>/end=<string:end>')             
def startEndRoute(ticker,s,e):
    return queryAPIstartEnd(ticker, s=s, e=e)

@app.route('/info/ticker=<string:ticker>')
def infoRoute(ticker):
    return infoQuery(ticker)
        
@app.route('/buildActive')
def buildActive():
    try:
        activeStock_df = pd.read_html('https://finance.yahoo.com/most-active')[0]
    except ValueError:
        temp = pd.read_html('https://finance.yahoo.com/trending-tickers')[0]
        temp = temp.iloc[range(0,5), range(0,6)]
        return temp.to_json(orient='records')
    top5_df = activeStock_df.iloc[range(0,5), range(0,6)]
    
    return top5_df.to_json(orient='records', date_format='iso')

@app.route('/piechart=<string:tickerString>')
def pieChart(tickerString):
    print('pie')
    volumeDict = {
        'labels': [],
        'volumes': []
    }
    for ticker in tickerString.split(','):
        times_tried=0
        received=False
        try:
            query = engine.execute(f'SELECT AVG("Volume") FROM "{ticker}"')
            received=True
        except:
            time.sleep(5)
            times_tried+=1
        for result in query:
            volumeDict['labels'].append(ticker)
            try:
                volumeDict['volumes'].append(float(result[0]))
            except TypeError:
                next
    return jsonify(volumeDict)
    
@app.route('/buildsql')
def buildSql():
    print('buildSQL')
    try:
        top5_df = pd.read_html('https://finance.yahoo.com/most-active')[0]
    except ValueError:
        top5_df = pd.read_html('https://finance.yahoo.com/trending-tickers')[0]
    search = ''
    searchList = []
    count = 0
    while count<5:
        search += top5_df['Symbol'].iloc[count] + ' '
        searchList.append(top5_df['Symbol'].iloc[count])
        count+=1
    tickers = yf.Tickers(search)
    stockDict = {}
    for name in tickers.tickers:
        stockSingle_df = name.history().iloc[:,range(0,5)]
        time.sleep(0.1)
        symbol = name.info['symbol']
        stockDict.update({symbol:stockSingle_df})
    for (ticker, df) in stockDict.items():
        df.to_sql(ticker, engine, if_exists='replace')
    return jsonify('Hello World')
        
if __name__ == "__main__":
    app.run(debug=True)   
