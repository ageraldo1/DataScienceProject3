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

@app.route("/home")
def home():
    return render_template("home.html")


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
                    "3": "Business Services",
                    "4" : "Professional Services",
                    "5": "Public Administration"}
    return jsonify(industry_key)

industry_key={ "1": "Agriculture",
                "2": "Manufacturing",
                "3": "Business Services",
                "4" : "Professional Services",
                "5": "Public Administration"}

# This Dictionary holds the educaiton values
education_key={ "0": "N/A",
                "1": "High School or less",
                "2": "College or less",
                "3": "Grad School or less"}

# This Dictionary holds the race values
race_key={  "1": "White/Caucasian",
            "2": "Black/African American",
            "3": "American Indian or Alaska Native",
            "4": "Asian or Pacific Islander",
            "5": "Other race",
            "6": "Two or more races",
            }

# This dictionary holds the sex values
sex_key={ "M": "Male",
            "F": "Female"}
   
employ_key={"1": "employed",
            "2":"unemployed"}

# This returns the data for the bubble graph This is not inflation adjusted
@app.route("/bubble_graph_no_inflation/<year>")
def bubble_list(year):
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT Income.Year, Income.Ind, Age.Age, Income.obs, Income.Income FROM Income , Age WHERE Age.ind=Income.ind AND Age.Year=Income.Year AND Income.Year={year};")
    results=cur.fetchall()
    bubble_group=[]
    for result in results:
        bubble_group.append(dict(industry=industry_key[result[1]],median_age=int(result[2]),jobs_number=int(result[3]),median_income=int(result[4])))
    return jsonify(bubble_group)

# This returns the data for the bar graph
@app.route("/bar_graph/<year>")
def bar_list(year):
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT DISTINCT Ind FROM Education")
    results=cur.fetchall()
    bar_group=[]
    industry_sid=[]
    for result in results:
        industry_sid.append(dict(industry=result[0]))

    for row in industry_sid:
        cur = conn.cursor()
        ind_sid=row['industry']
        cur.execute(f"SELECT Obs, Education FROM Education WHERE Year={year} AND Ind='{ind_sid}' AND Education!='0';")
        results2=cur.fetchall()
        bar_group.append(dict(industry=industry_key[ind_sid],education=[{'education_level':education_key[results2[0][1]],
                                                                        'number_employed':results2[0][0]},
                                                                        {'education_level':education_key[results2[1][1]],
                                                                        'number_employed':results2[1][0]},
                                                                        {'education_level':education_key[results2[2][1]],
                                                                        'number_employed':results2[2][0]},
                                                                        ]))
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
            "11":"Washington DC",
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
    cur.execute(f"SELECT Obs, race FROM allrace WHERE Year='{year}' AND Ind='{industry_sid}';")
    results=cur.fetchall()
    race_dict={}
    for result in results:
        race_dict.update( { race_key[result[1]] : int(result[0])} )
    # If there is no race data for the year, return this dictionary
    if not results:
        race_dict={
            'White/Caucasian': 1000,
            'Black/African American': 1000,
            'American Indian or Alaska Native': 1000,
            'Asian or Pacific Islander': 1000,
            'Other race': 1000
        }
    return jsonify(race_dict)

# This dictionary is made from using data on https://westegg.com/inflation/infl.cgi
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

# This funmction calculates 2017 inflaiton adjusted dollars using the dictionary.
def inflation_adjust(year, dollars):
    return float(dollars)*inflation_dict[str(year)]

# This function brings the inflation adjusted dollars into the bubble graph
@app.route("/bubble_graph/<year>")
def bubble_inflation(year):
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT Income.Year, Income.Ind, Age.Age, Income.obs, Income.Income FROM Income , Age WHERE Age.ind=Income.ind AND Age.Year=Income.Year AND Income.Year={year};")
    results=cur.fetchall()
    bubble_group=[]
    for result in results:
        bubble_group.append(dict(industry=industry_key[result[1]],median_age=int(result[2]),jobs_number=int(result[3]),median_income=inflation_adjust(year,result[4])))
    return jsonify(bubble_group)

# Returns the income KPI adjusted for inflation
@app.route("/income_kpi/<year>")
def income_kpi(year):
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT income FROM Year_income WHERE Year='{year}';")
    results=cur.fetchall()
    income=float(results[0][0])*inflation_dict[str(year)]
    return jsonify(income)

# finding annual employment rates of these categories
@app.route("/employment_kpi/<year>")
def employment_kpi(year):
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT obs, employ FROM Year_employ WHERE Year='{year}';")
    results=cur.fetchall()
    raw_emp={}
    for result in results:
        dict_title=employ_key[result[1]]
        raw_emp.update( { dict_title : float(result[0])} )
    pct_results= { 'employed' : 100*raw_emp['employed'] /(raw_emp['employed']+raw_emp['unemployed']) ,
                'unemployed' : 100*raw_emp['unemployed'] /(raw_emp['employed']+raw_emp['unemployed']) }
    return jsonify(pct_results)

#Bisecting the employment by state in case we want to slice it
@app.route("/emp_by_ind_kpi/<year>/<industry_sid>")
def emp_ind_kpi(year,industry_sid):
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT obs, employ FROM employ WHERE Year='{year}' AND Ind='{industry_sid}';")
    results=cur.fetchall()
    raw_emp={}
    for result in results:
        dict_title=employ_key[result[1]]
        raw_emp.update( { dict_title : float(result[0])} )
    pct_results= { 'employed' : 100*raw_emp['employed'] /(raw_emp['employed']+raw_emp['unemployed']) ,
                'unemployed' : 100*raw_emp['unemployed'] /(raw_emp['employed']+raw_emp['unemployed']) }
    return jsonify(pct_results)

# This one uses a hard coded max from the inflation kpi to calculate a percentage
@app.route("/income_pct_kpi/<year>")
def income_pct_kpi(year):
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT income , year FROM Year_income;")
    results=cur.fetchall()
    income_list=[]
    for result in results:
        income_list.append(float(result[0])*inflation_dict[result[1]])
    income_list.sort(reverse=True)
    conn = sqlite3.connect("./data/Project3.db")
    cur = conn.cursor()
    cur.execute(f"SELECT income FROM Year_income WHERE Year='{year}';")
    results=cur.fetchall()
    income=100*float(results[0][0])*inflation_dict[str(year)]/income_list[0]
    return jsonify(income)

@app.route("/summary")
def summary():
    yearrange= ["1950" , "1960" , "1970" , "1980" , "1990" , "2000" , "2010" , "2015" , "2017"]
    industry_range= [ "1" , "2", "3", "4" , "5"]
    summary_results=[]
    for yr in yearrange:
        for industry_id in industry_range:
            conn = sqlite3.connect("./data/Project3.db")
            cur = conn.cursor()
            cur.execute(f"SELECT obs, employ FROM Employ WHERE Year='{yr}' AND Ind='{industry_id}';")
            results=cur.fetchall()
            raw_emp={}
            for result in results:
                dict_title=employ_key[result[1]]
                raw_emp.update( { dict_title : float(result[0])} )
            try:
                pct_results= { 'employment_rate' : 100*raw_emp['employed'] /(raw_emp['employed']+raw_emp['unemployed']) , 
                        'year' : yr, 
                        "Industry" : industry_key[industry_id]
                        }
            except:
                pct_results= { 'employment_rate' : 100 , 
                        'year' : yr, 
                        "Industry" : industry_key[industry_id]
                        }
            summary_results.append(pct_results)    
    return jsonify(summary_results)

if __name__ == "__main__":
    app.run(debug=True)
