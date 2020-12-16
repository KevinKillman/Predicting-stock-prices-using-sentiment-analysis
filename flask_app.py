from flask import Flask, jsonify                     #imports Flask CLASS and jsonify funct
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

def queryAPIperiod(ticker, period='ytd', interval='1d'):
    import yfinance as yf
    return yf.Ticker(ticker).history(period=period, interval=interval).to_csv()
                   
def queryAPIstartEnd(ticker, start='1986-03-13', end='2020-12-14'):
    import yfinance as yf
    return yf.Ticker(ticker).history(start=start, end=end).to_csv()

@app.route('/ticker=<string:ticker>')             
def index(ticker):
    return queryAPIperiod(ticker)

@app.route('/ticker=<string:ticker>/period=<string:period>')             
def periodRoute(ticker, period):
    return queryAPIperiod(ticker, period=period)

@app.route('/ticker=<string:ticker>/period=<string:period>/interval=<string:interval>')             
def periodIntervalRoute(ticker, period, interval):
    return queryAPIperiod(ticker, period=period, interval=interval)
    
@app.route('/ticker=<string:ticker>/start=<string:start>/end=<string:end>')             
def startEndRoute(ticker,start,end):
    return queryAPIperiod(ticker, start=start, end=end)
        
        
        
        
        
        
if __name__ == "__main__":
    app.run(debug=True)   