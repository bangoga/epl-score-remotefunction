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

with open('text-data/Manchester United/29.txt', 'r') as f:
    lines = [line.rstrip() for line in f]