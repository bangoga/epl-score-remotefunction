# -*- coding: utf-8 -*-
"""
Created on Tue Apr 28 12:45:07 2020

@author: mohsi
"""

# The idea is to read text file, recontextualize it and then save it as a json/

import json


with open('2019.json', 'r') as f:
    plleague = json.load(f)

match_details_obj = plleague['data'] 
match_less={"matches":[]}

"""
[Type Dictionary]              [Type List]          [Type Dictionary]     [Variable information]
    match_less      =>         matches              => match_name1     => Home,Away,Possession,GS,GA,time,clear chances,missed,chances,fouls.....
                                                    
                                                    
                                                    => match_name2
                                                    => match_name3
                                                    
                                                    
Data to save :  [       Home vs Away             ]
                [       HomeGoal vs AwayGoal     ]
                [       Goal Time STR            ]
                [       Possession for teams     ]
                [       HomeGoal vs AwayGoal     ]
                [       Shots by teams           ]
                [       Shots on target          ]
                [       Passes                   ]
                [       Pass Accuracy            ]
                [       Types of Passes          ]
                [       Tackles                  ]
                [       Clearances               ]
                [       Corners                  ]
                [       Offside                  ]
                [       Dispiline                ]
                [       Crosses                  ]
                [       Through                  ]
                [       Long vs Short            ]
"""
for match in match_details_obj:
    
    # Create a keyname
    print(match['team_a_attacks'])
    


# function that reads data saved and recorded in text 

with open('text-data/Manchester United/1.txt', 'r') as f:
    lines = [line.rstrip() for line in f]
    
    







class match_details:
    def __init__(self, file):
        self.file = file
        self.data_list=[]
        
    def form_list_data(self):
        i=1
        while(i<len(self.file)):
            self.data_list.append({self.file[i]:[self.file[i-1],self.file[i+1]]})
            i=i+3 
    
    def getBlockedShots(self):
        return self.data_list[4].get("Blocked shots")
    
    def getWoodHit(self):
        return self.data_list[11].get("Hit woodwork")
    
    def getShotIn(self):
        return self.data_list[13].get("Shots inside box")
    
    def getShotOut(self):
        return self.data_list[14].get("Shots outside box")
    
    def getPasses(self):
        return self.data_list[16].get("Passes")
    
    def getPassAccuracy(self):
        return self.data_list[17].get("Acc. passes")
    
    def getLongBalls(self):
        return self.data_list[18].get("Long balls")
    
    def getCrosses(self):
        return self.data_list[19].get("Crosses")
    
    def getAerialDuels(self):
        return self.data_list[4].get("Blocked shots")
    
    def getDuels(self):
        return self.data_list[4].get("Blocked shots")
    
    def getInterceptions(self):
        return self.data_list[4].get("Blocked shots")
    
    def getClearance(self):
        return self.data_list[4].get("Blocked shots")
         

         
    def getDribbles(self):
        return self.data_list[4].get("Blocked shots")
        
    def getTackles(self):
        return self.data_list[4].get("Blocked shots")
    
    def getKeeperSaves(self):
        return self.data_list[4].get("Blocked shots")
    

match = match_details(lines)
match.form_list_data()
print(match.getPasses())






# Pass it the txt file 
def getPasses(pass_type,file):
    return 0

def getTackles(file):
    return 0

def getClearances(file):
    return 0

def getCorners(file):
    corners = [file[12],file[12]];
    return corners

def getOffside(file):
    return 0

# get long and short shots
def getShot(shot_type,file):
    return 0

def getXG(file):
    return 0


