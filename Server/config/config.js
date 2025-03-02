const config = {
    currentConstructionAPI: 'https://utility.arcgis.com/usrsvcs/servers/fe45821bc236443d84b5fc3698f583bf/rest/services/OpenData/OpenData/MapServer/24/query?outFields=*&where=1%3D1&f=geojson',
    futureConstructionAPI: 'https://utility.arcgis.com/usrsvcs/servers/737980ba63a34f9ca0cb8e1b5cea6c6d/rest/services/OpenData/OpenData/MapServer/25/query?outFields=*&where=1%3D1&f=geojson',
    emergencyAPI: 'https://services1.arcgis.com/qAo1OsXi67t7XgmS/arcgis/rest/services/Emergency_Services/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson',
    incidentAPI: 'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d',
    geoCodeAPI: 'https://api.geocode.earth/v1/search?',
    geoCodeApiKey: 'ge-20f850ce081d1822',
};

module.exports = config;
