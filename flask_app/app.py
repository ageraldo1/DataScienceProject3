import sqlite3
from flask import Flask, jsonify, render_template
from datetime import datetime as dt
import pandas as pd
import numpy as np
# from flask_restplus import Resource, Api, Namespace

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/timespan")
def years():
    # connect to the db
    conn = sqlite3.connect("./data/mockdata.sqlite")
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT year FROM mockdata ORDER BY year")
    results=cur.fetchall()
    year_list=[]
    for result in results:
        year_list.append(result[0])
    return jsonify(year_list)

@app.route("/states_group")
def states():
    conn = sqlite3.connect("./data/mockdata.sqlite")
    cur = conn.cursor()
    cur.execute("SELECT state, Industry,year,total_pop,education,income,pct_urb FROM mockdata GROUP BY state")
    results=cur.fetchall()
    states_group=[]
    for result in results:
        states_group.append(dict(state=result[0],industry=result[1],year=result[2],total_population=result[3],education=result[4],income=result[5]))
    return jsonify(states_group)

@app.route("/time_series")
def time_series():
    conn = sqlite3.connect("./data//mockdata.sqlite")
    cur = conn.cursor()
    cur.execute("SELECT count(total_pop) AS Jobs, Industry,year FROM mockdata GROUP BY Industry,year")
    results=cur.fetchall()
    time_group=[]
    for result in results:
        time_group.append(dict(jobs=result[0],industry=result[1],year=result[2]))
    return jsonify(time_group)


@app.route("/time_range/<start>/<end>")
def time_ranged_data(start, end):
    conn = sqlite3.connect("./data//mockdata.sqlite")
    cur = conn.cursor()
    cur.execute(f"SELECT total_pop, year FROM mockdata WHERE year >= {start} and year <= {end} ;")
    results=cur.fetchall()
    range_group=[]
    for result in results:
        range_group.append(dict(jobs=result[0],year=result[1]))
    return jsonify(range_group)

# @app.route("/api/v1.0/precipitation/")
# def precipitation():
#     # connect to the db
#     conn = sqlite3.connect("../Resources/hawaii.sqlite")
#     cur = conn.cursor()
#     # select date and precipitation from the db
#     cur.execute("SELECT date, prcp FROM measurement")
#     result= cur.fetchall()
#     # create and add results into the dictionary
#     precip_dict= {}
#     {precip_dict.setdefault(key, []).append(precip) for key, precip in result}
#     return jsonify(precip_dict)



# @app.route("/api/v1.0/tob/")
# def tob():
#     conn = sqlite3.connect("../Resources/hawaii.sqlite")
#     cur = conn.cursor()

#     #Find the highest date in the DB
#     cur.execute("SELECT MAX(date) FROM measurement")
#     max_date=cur.fetchall()
#     #Convert to a string
#     date_str=max_date[0][0]
#     #Convert to a date format
#     date_dt=dt.strptime(date_str,'%Y-%m-%d')
#     #Subtract a year to find the date for the query
#     new_date=date_dt.replace(date_dt.year-1)
#     #convert back to string
#     new_str=new_date.strftime('%Y-%m-%d')
#     #query for the data
#     cur.execute(f"SELECT date, tobs FROM measurement WHERE date > '{new_str}'")
#     result= cur.fetchall()
#     tobs_dict= {}
#     {tobs_dict.setdefault(key, []).append(tobs) for key, tobs in result}
#     return(jsonify(tobs_dict))

# @app.route("/api/v1.0/<start>")
# def temp_past(start):
#     try:
#         ##This date conversion verifies that the url is properly formatted
#         min_date=dt.strptime(start,'%Y-%m-%d')
#         ## Connect to db
#         conn = sqlite3.connect("../Resources/hawaii.sqlite")
#         cur = conn.cursor()

#         ## find min and max date on db
#         cur.execute("SELECT MIN(date),MAX(date) FROM measurement")
#         db_result=cur.fetchall()
#         #Convert to a string
#         min_str=db_result[0][0]
#         max_str=db_result[0][1]

#         # Check to see if the date ranges are out of bounds
#         if start < min_str:
#             results={"error": f"{start} is less than the earliest database date of {min_str}"}
#         elif start > max_str:
#             results={"error": f"{start} is greater than the latest database date of {max_str}"}
#         else:
#             #select the aggretate temperatures of the dates greater than start date
#             cur.execute(f"SELECT MIN(tobs),MAX(tobs),AVG(tobs) FROM measurement WHERE date >= {start}")
#             temp_results=cur.fetchall()
#             #format the results for the average of those dates
#             results={"start":start,
#                      "end":max_str,
#                      "TMIN":temp_results[0][0],
#                      "TMAX":temp_results[0][1],
#                      "TAVG":"{0:.1f}".format(temp_results[0][2])}
#         return jsonify(results),200
#     except: 
#         #return an error if there's a date typo
#         results={"error": f"{start} is not date format of YYYY-MM-DD or an API path"}
#         return jsonify(results),404
    
# @app.route("/api/v1.0/<start>/<end>")
# def temp_range(start,end):
#     try:
#         min_date=dt.strptime(start,'%Y-%m-%d')
#         max_date=dt.strptime(end,'%Y-%m-%d')

#         ## Connect to db
#         conn = sqlite3.connect("../Resources/hawaii.sqlite")
#         cur = conn.cursor()

#         ## find min and max date on db
#         cur.execute("SELECT MIN(date),MAX(date) FROM measurement")
#         db_result=cur.fetchall()
#         #Convert to a string
#         min_str=db_result[0][0]
#         max_str=db_result[0][1]

#         # For date error handling, I have 3 categories, if the start is earlier than the 
#         # first db date, if the end is greater than the last db date, and if the start is 
#         # greater than the end.
#         if start > end:
#             results={"error":f"Start date {start} is greater than end date {end}."}
#         elif start < min_str:
#             results={"error": f"{start} is less than the earliest database date of {min_str}"}
#         elif end > max_str:
#             results={"error": f"{end} is greater than the latest database date of {max_str}"}
                
#         else:
#             # find min max and rage of temp for those dates
#             cur.execute(f"SELECT MIN(tobs),MAX(tobs),AVG(tobs) FROM measurement WHERE date >= '{start}' AND date <= '{end}' AND tobs IS NOT NULL")
#             temp_results=cur.fetchall()
#             # return the results
#             results={"start":start,
#                      "end":end,
#                      "TMIN":temp_results[0][0],
#                      "TMAX":temp_results[0][1],
#                      "TAVG":"{0:.1f}".format(temp_results[0][2])
#                     }
#         return jsonify(results),200
#     except: 
#         #return an error if there's a date typo
#         results={"error": f"{start} is not date format of YYYY-MM-DD or an API path"}
#         return jsonify(results),404

if __name__ == "__main__":
    app.run(debug=True)
