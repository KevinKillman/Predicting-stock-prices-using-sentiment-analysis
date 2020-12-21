from flask import Flask, jsonify, render_template                     #imports Flask CLASS and jsonify funct
from flask_cors import CORS
import yfinance as yf
import os
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
from sqlalchemy import *
import time

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db.sqlite"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

def infoQuery(ticker):
    return yf.Ticker(ticker).info

def queryAPIperiod(ticker, period='ytd', interval='1d'):
    stock_df = yf.Ticker(ticker).history(period=period, interval=interval)
    stock_df.dropna(inplace=True)
    stock_df.reset_index(inplace=True)
    return stock_df.to_json(orient='records', date_format='iso')
                   
def queryAPIstartEnd(ticker, s='1986-03-13', e='2020-12-14'):

    return yf.Ticker(ticker).history(start=s, end=e).reset_index(inplace=True).to_json(orient='records', date_format='iso')

@app.route('/')
def index():
    return render_template('index.html')

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
    activeStock_df = pd.read_html('https://finance.yahoo.com/most-active')[0]
    top5_df = activeStock_df.iloc[range(0,5), range(0,6)]
    return top5_df.to_json(orient='records', date_format='iso')
        
    
        
        
if __name__ == "__main__":
    app.run(debug=True)   