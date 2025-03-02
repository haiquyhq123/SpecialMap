
### Infra structure
![image](https://github.com/user-attachments/assets/cd36ab45-9f35-4584-9b92-96c8ae1f20db)

##### API
#### `Incident Informations`
##### <span style="background-color:#33FF33; color:#000000"> GET  </span> /api/police-news/incidents
```
   Responese Sample
   
	dailyIncidents": [
        {
            "title": "WA25053206-SELECTIVE TRAFFIC ENFORCEMENT PROGRAM (STEP)",
            "posted_date": "Posted Saturday, 01 March, 2025",
            "incident_number": "WA25053206",
            "incident_date": "Mar 1, 2025 9:46:30 AM",
            "location": "ST CHARLES ST W and GREENWOOD RD, WOOLWICH ON",
            "latitude": "43.5108600",
            "longitude": "-80.4576760",
            "created_at": "2025-03-02T03:47:12.000Z"
        },
        {
            "title": "WA25053204-SELECTIVE TRAFFIC ENFORCEMENT PROGRAM (STEP)",
            "posted_date": "Posted Saturday, 01 March, 2025",
            "incident_number": "WA25053204",
            "incident_date": "Mar 1, 2025 9:42:57 AM",
            "location": "ARTHUR ST S and LISTOWEL RD, WOOLWICH ON",
            "latitude": "43.5762570",
            "longitude": "-80.5632790",
            "created_at": "2025-03-02T03:47:13.000Z"
        },
    ]
```

##### <span style="background-color:#33FF33; color:#000000"> GET  </span> /api/police-news/incidents/{:id}
```
   Responese Sample
   
    "dailyIncidents": [
        {
            "id": 934,
            "title": "WA25051771-BREAK & ENTER",
            "posted_date": "Posted Thursday, 27 February, 2025",
            "incident_description": null,
            "incident_date": "Feb 27, 2025 7:06:11 PM",
            "location": "GEORGE AYRES DR, KITCHENER, ON",
            "created_at": "2025-03-02T05:01:13.000Z",
            "receivedFrom": "0",
            "latitude": "43.3739540",
            "longitude": "-80.4294550",
            "incident_number": "WA25051771"
        }
    ]
```

#### `Construction Information`
##### <span style="background-color:#33FF33; color:#000000"> GET  </span> /api/arcgis/saved
```
    "data": {
        "features": [
            {
                "id": 4156272,
                "type": "Feature",
                "geometry": {
                    "type": "MultiLineString",
                    "coordinates": [
                        [
                            [
                                -80.488860536512,
                                43.37964961351686
                            ],
                            [
                                -80.48855120320017,
                                43.379424782812336
                            ],
                            [
                                -80.4888605363316,
                                43.37919995270355
                            ],
                            [
                                -80.48916987089362,
                                43.379424782585716
                            ],
                            [
                                -80.488860536512,
                                43.37964961351686
                            ]
                        ],
                        [
                            [
                                -80.48802419005929,
                                43.379772796852784
                            ],
                            [
                                -80.4877148555188,
                                43.37954796568757
                            ],
                            [
                                -80.48802418989605,
                                43.379323136052605
                            ],
                            [
                                -80.4883335244523,
                                43.37954796638998
                            ],
                            [
                                -80.48802419005929,
                                43.379772796852784
                            ]
                        ]
                    ]
                },
                "properties": {
                    "DETOUR": "",
                    "REASON": "Other",
                    "STATUS": "No Closure",
                    "CONTACT": "Mike Albrecht - malbrecht@regionofwaterloo.ca - 226-753-9066",
                    "DATE_TO": 1746133200000,
                    "DETAILS": "No lane closures; work occurring off road; pedestrian traffic maintained around work zone.",
                    "OBJECTID": 4156272,
                    "DATE_FROM": 1714561200000,
                    "Edit_Date": 1718314683000,
                    "Edit_User": "RMW",
                    "STREET_TO": "",
                    "CLOSURE_ID": 4067594,
                    "Create_Date": 1718311197000,
                    "Create_User": "Transnomis",
                    "Description": "Fischer-Hallman Rd 310m South of Huron Rd",
                    "OPEN_STATUS": "Road Closed",
                    "Responsible": "Transportation",
                    "STREET_FROM": "",
                    "STREET_NAME": "Fischer-Hallman Rd and Huron Rd",
                    "CLOSURE_TYPE": "Road",
                    "MUNICIPALITY": "Kitchener",
                    "ORGANIZATION": "Kitchener",
                    "EMERGENCY_REASON": null,
                    "SHAPE.STLength()": 282.99782113070444,
                    "CLOSURE_SCHEDULED": "Existing"
                }
            },
            .
            .
      ]
```

#### `Emergency`
##### <span style="background-color:#33FF33; color:#000000"> GET  </span> /api/emergency/saved
```
   Responese Sample
   
    "data": {
        "features": [
            {
                "id": 1,
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        -80.5445560914551,
                        43.4980472599825
                    ]
                },
                "properties": {
                    "SOURCE": "CITY OF WATERLOO WEBSITE",
                    "STATUS": "ACTIVE",
                    "STREET": "NORTHFIELD DR",
                    "ON_CALL": "N",
                    "CATEGORY": "FIRE STATION",
                    "CIVIC_NO": 150,
                    "LANDMARK": "WATERLOO FIRE STATION #3",
                    "OBJECTID": 1,
                    "MAP_LABEL": "Waterloo Fire Station #3",
                    "OWNERSHIP": "WATERLOO",
                    "LANDMARKID": 555,
                    "CREATE_DATE": 1048069539000,
                    "SOURCE_DATE": null,
                    "STATUS_DATE": null,
                    "SUBCATEGORY": "WATERLOO",
                    "UPDATE_DATE": 1402321494000,
                    "CONSTRUCTION_YEAR": null,
                    "MUNICIPAL_FACILITY": "N",
                    "ASSOCIATED_LAND_AREA": null,
                    "DIVISION_RESPONSIBLE": "NON-CITY",
                    "LOCATION_DESCRIPTION": null,
                    "COMMON_LOCATION_REFERENCE": null
                }
            },
      ]
```

#### `User`
##### <span style="background-color:#33FF33; color:#000000"> GET  </span>  /api/user
```
   Responese Sample
   
    "dailyIncidents": [
        {
            "id": 934,
            "title": "WA25051771-BREAK & ENTER",
            "posted_date": "Posted Thursday, 27 February, 2025",
            "incident_description": null,
            "incident_date": "Feb 27, 2025 7:06:11 PM",
            "location": "GEORGE AYRES DR, KITCHENER, ON",
            "created_at": "2025-03-02T05:01:13.000Z",
            "receivedFrom": "0",
            "latitude": "43.3739540",
            "longitude": "-80.4294550",
            "incident_number": "WA25051771"
        }
    ]
```
