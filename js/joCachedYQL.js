joCachedYQL = function(query,lifetime) {
	joYQL.call(this);
	this.setQuery(query);
	this.lifetime = lifetime;
}
joCachedYQL.extend(joYQL, {
	exec: function() {
		var timestamp = parseInt(localStorage.getItem(this.query + '.timestamp'));
		var now = (new Date()).getTime();
		if (this.lifetime > 0 && timestamp && now - timestamp < this.lifetime) {
			var data = JSON.parse(localStorage.getItem(this.query + '.data'));
            console.log(data);
            //alert(data);
			joYQL.prototype.load.call(this,data);
		}
		else {
			joYQL.prototype.exec.call(this);	
		}
	},
	
	load: function(data) {
        data = this.postProcess(data);
		if (this.lifetime > 0) {
			var now = (new Date()).getTime();
			localStorage.setItem(this.query + '.timestamp', now);
			localStorage.setItem(this.query + '.data', JSON.stringify(data));
		}
		joYQL.prototype.load.call(this,data);
		
	},
    
    postProcess: function(data) {
        return data;
    },
	
	forceReload: function() {
		joYQL.prototype.exec.call(this);	
	},
	
	setLifeTime: function(lifetime) {
		this.lifetime = lifetime;
	}
});