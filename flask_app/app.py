import sqlite3
from flask import Flask, jsonify, render_template
from datetime import datetime as dt
from flask_cors import CORS 
import pandas as pd
import numpy as np
# from flask_restplus import Resource, Api, Namespace

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)

#################################################
# Flask Routes
#################################################


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

## Select all the years in the project
@app.route("/timespan")
def years():
    # connect to the db
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT Year FROM Employ ORDER BY year")
    results=cur.fetchall()
    year_list=[]
    for result in results:
        year_list.append(result[0])
    return jsonify(year_list)

# This API returns the dictionary name for the industry key
@app.route("/industry_key")
def industry_key():
    industry_key={ "1": "Agriculture",
                    "2": "Manufacturing",
                    "3": "Business & Repair Services",
                    "4" : "Professional & Related Services",
                    "5": "Public Administration"}
    return jsonify(industry_key)

# This Dictionary holds the educaiton values
education_key={ "0": "N/A or No Schooling",
                "1": "Elementary, Middle, and/or High School",
                "2": "College",
                "3": "Graduate Degree"}

# This Dictionary holds the race values
race_key={  "1": "White",
            "2": "Black/African American",
            "3": "American Indian or Alaska Native",
            "4": "Asian or Pacific Islander",
            "5": "Other race",
            "6": "Two or more races",
            }

# This dictionary holds the sex values
sex_key={ "M": "Male",
            "F": "Female"}
   

# This returns the data for the bubble graph
@app.route("/bubble_graph/<year>")
def bubble_list(year):
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT Income.Year, Income.Ind, Age.Age, Income.obs, Income.Income FROM Income , Age WHERE Age.ind=Income.ind AND Age.Year=Income.Year AND Income.Year={year};")
    results=cur.fetchall()
    bubble_group=[]
    for result in results:
        bubble_group.append(dict(ndustry_sid=result[1],median_age=int(result[2]),jobs_number=int(result[3]),median_income=int(result[4])))
    return jsonify(bubble_group)

# This returns the data for the bar graph
@app.route("/bar_graph/<year>")
def bar_list(year):
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT Year, Ind, Obs, Education FROM Education WHERE Year={year};")
    results=cur.fetchall()
    bar_group=[]
    for result in results:
        bar_group.append(dict(industry_sid=result[1],number_employed=int(result[2]),education_level=education_key[result[3]]))
    return jsonify(bar_group)

# This dictionary holds the state values
state_dict={ "1":"Alabama",
            "2":"Alaska",
            "4":"Arizona",
            "5":"Arkansas",
            "6":"California",
            "8":"Colorado",
            "9":"Connecticut",
            "10":"Delaware",
            "12":"Florida",
            "13":"Georgia",
            "15":"Hawaii",
            "16":"Idaho",
            "17":"Illinois",
            "18":"Indiana",
            "19":"Iowa",
            "20":"Kansas",
            "21":"Kentucky",
            "22":"Louisiana",
            "23":"Maine",
            "24":"Maryland",
            "25":"Massachusetts",
            "26":"Michigan",
            "27":"Minnesota",
            "28":"Mississippi",
            "29":"Missouri",
            "30":"Montana",
            "31":"Nebraska",
            "32":"Nevada",
            "33":"New Hampshire",
            "34":"New Jersey",
            "35":"New Mexico",
            "36":"New York",
            "37":"North Carolina",
            "38":"North Dakota",
            "39":"Ohio",
            "40":"Oklahoma",
            "41":"Oregon",
            "42":"Pennsylvania",
            "44":"Rhode Island",
            "45":"South Carolina",
            "46":"South Dakota",
            "47":"Tennessee",
            "48":"Texas",
            "49":"Utah",
            "50":"Vermont",
            "51":"Virginia",
            "53":"Washington",
            "54":"West Virginia",
            "55":"Wisconsin",
            "56":"Wyoming" }

# API for the data from the chloropleth
@app.route("/states_chlorpleth/<year>/<industry_sid>")
def states_map(year, industry_sid):
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT obs, state FROM XState WHERE year='{year}' AND industry='{industry_sid}';")
    results=cur.fetchall()
    states_group=[]
    for result in results:
        states_group.append(dict(jobs=result[0],state=state_dict[result[1]]))
    return jsonify(states_group)


# API for the pie graph for gender
@app.route("/gender_pie/<year>/<industry_sid>")
def gender_pie(year,industry_sid):
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT Obs, sex FROM allsex WHERE Year='{year}' AND Ind='{industry_sid}';")
    results=cur.fetchall()
    gender_group={ sex_key[results[0][1]] : results[0][0],sex_key[results[1][1]] : results[1][0]}
    return jsonify(gender_group)

## API for the pie graph for ethnicity
@app.route("/race_pie/<year>/<industry_sid>")
def race_pie(year,industry_sid):
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT Obs, race FROM all_race WHERE Year='{year}' AND Ind='{industry_sid}';")
    results=cur.fetchall()
    race_dict={}
    for result in results:
        race_dict.update( { race_key[result[1]] : int(result[0])} )
    # If there is no race data for the year, return this dictionary
    if not results:
        race_dict={
            'White': 1000,
            'Black/African American': 1000,
            'American Indian or Alaska Native': 1000,
            'Asian or Pacific Islander': 1000,
            'Other race': 1000
        }
    return jsonify(race_dict)

inflation_dict= {
      "1950" : 10.35, 
      "1960" : 8.41, 
      "1970" : 6.42, 
      "1980" : 3.02 , 
      "1990" : 1.90, 
      "2000" : 1.45, 
      "2010" : 1.16, 
      "2015" : 1.04, 
      "2017" : 1.00
}

def inflation_adjust(year, dollars):
    return float(dollars)*inflation_dict[str(year)]

@app.route("/bubble_inflation/<year>")
def bubble_inflation(year):
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT Income.Year, Income.Ind, Age.Age, Income.obs, Income.Income FROM Income , Age WHERE Age.ind=Income.ind AND Age.Year=Income.Year AND Income.Year={year};")
    results=cur.fetchall()
    bubble_group=[]
    for result in results:
        bubble_group.append(dict(ndustry_sid=result[1],median_age=int(result[2]),jobs_number=int(result[3]),median_income=inflation_adjust(year,result[4])))
    return jsonify(bubble_group)

if __name__ == "__main__":
    app.run(debug=True)
