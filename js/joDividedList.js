joDividedList = function(data) {
	joList.call(this, data);
}
joDividedList.extend(joList, {
	divideList : function() {
		this.listDividers = {}
		for(var i = 0, l = this.data.length; i < l; i++) {
			var listDivider = this.listDivider(this.data[i]);
			if(!this.listDividers.hasOwnProperty(listDivider))
				this.listDividers[listDivider] = [];
			this.listDividers[listDivider].push(this.data[i]);
		}
	},
	draw : function() {
		if( typeof this.data === 'undefined' || !this.data || !this.data.length) {
			if(this.defaultMessage)
				this.container.innerHTML = this.defaultMessage;
			return;
		}
		
		var length = 0;
		var listDividerIndex = 0;
		this.indexToNode = [];

		if(this.useListDividers) {
			for(listDivider in this.listDividers) {
				++listDividerIndex;
				this.appendItem(this.formatListDivider(listDivider), 'jodivider');
				length += this.drawItems(this.listDividers[listDivider], listDividerIndex, length);
			}
		} else {
			this.drawItems(this.data,0,0);
		}

		// refresh our current selection
		if(this.value >= 0)
			this.setValue(this.value, true);

		return;
	},
	drawItems : function(items, dividerIndex, length) {
		for(var i = 0, l = items.length; i < l; i++) {
			this.appendItem(this.formatItem(items[i], length + i, this.data.length, (i == 0 ? 'first':'') + (i == items.length -1 ? ' last':'')),'jolistitem');
			this.indexToNode[i+length] = dividerIndex + length + i;
		}
		return i;
	},
	
	getNode : function(index) {
		return this.container.childNodes[this.indexToNode[index]];
	},
	appendItem : function(element, tag) {
		if(element == null)
			return;
		if( typeof element === "string") {
			var e = joDOM.create(tag)
			e.innerHTML = element;
			element = e;		
		}
		this.container.appendChild(( element instanceof joView) ? element.container : element);
	},
	setDivide : function(state) {
		this.useListDividers = state;
	},
	listDivider : function(item, i) {
		return item.toString().charAt(0).toUpperCase();
	},
	formatListDivider : function(listDivider) {
		return new joDivider('<div class="caption">' + listDivider + '</div><div class="count">' + this.listDividers[listDivider].length + '</div><div style="clear:both" />');
	},
	formatItem : function(data, index, length, classes) {
		var element = joList.prototype.formatItem.call(this, data, index);
		element.setAttribute("class",classes);
		return element;
	},
	refresh : function() {
		if(this.autoSort)
			this.sort();

		if(this.useListDividers)
			this.divideList();

		joControl.prototype.refresh.apply(this);
	}
});
