Models = function() {
	
	this.locations = new joCachedYQL(
            "SELECT name,id FROM xml WHERE " + 
            "url='http://cb.heimat.de/interface/api/location.php?city=1656'"+
            "AND itemPath='/dataset/location'");
        
    this.locations.setLifeTime(1000000);
    
    this.locations.postProcess = function(data) {
            data.query.results.item = {};
            for (var i=0; i < data.query.results.location.length; i++) {
                var item = data.query.results.location[i];
                data.query.results.item[item['id']] = item;
            }
            delete(data.query.results.location);
            return data;
        }
        
        
     this.events = new joCachedYQL(
            "SELECT location,title,event FROM xml WHERE "+
            "url='http://www.bielefeld.de/data/kulturserver/veranstaltungen.xml'" +
            "AND itemPath='/dataset/production'");
            
     this.events.setLifeTime(1000000);
     
     this.events.postProcess = function(data) {
            items = data.query.results.production;
            delete(data.query.results.production)
            data.query.results.item = [];
            for (k =0;k<items.length;k++) {
                item = items[k];
                if (typeof item.event.datetime == 'undefined') { 
                    for (i=0; i < item.event.length; i++) {
                        var event = item.event[i];
                        var itemToAdd = {};
                        for (l in item) {
                            if (l != 'event') {
                                itemToAdd[l] = item[l];
                            }
                        }
                        console.log(itemToAdd);
                        itemToAdd.datetime = (new Date(event.datetime.toString().replace(/-/g, '/'))).getTime();
                        data.query.results.item.push(itemToAdd);
                    }
                }
                else {
                    item.datetime = (new Date(item.event.datetime.toString().replace(/-/g, '/'))).getTime();
                    data.query.results.item.push(item);
                }
            }
            
            return data;
        }
        
        this.locations.changeEvent.subscribe(events.exec,events);
}
