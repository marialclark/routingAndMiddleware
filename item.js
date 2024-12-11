const items = require('./fakeDb');

class Item {
	constructor(name, price) {
		this.name = name;
		this.price = price;

		global.items.push(this);
	}
}

module.exports = Item;
