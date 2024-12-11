const Item = require('../item');
const express = require('express');
const ExpressError = require('../expressError');

const router = express.Router();

// GET /items - renders a list of shopping items
router.get('/', function (req, res, next) {
	try {
		return res.json(global.items);
	} catch (e) {
		return next(e);
	}
});

// POST /items - accepts JSON data and adds to shopping list/items database array
router.post('/', function (req, res, next) {
	try {
		const { name, price } = req.body;
		if (!name || price === undefined) {
			throw new ExpressError('Name and price are required', 400);
		}
		const newItem = new Item(name, price);
		return res.status(201).json({ item: newItem });
	} catch (e) {
		return next(e);
	}
});

// GET /items/:name - displays a single item's name and price
router.get('/:name', function (req, res, next) {
	try {
		const chosenItem = global.items.find(
			(item) => item.name === req.params.name
		);
		if (!chosenItem) {
			throw new ExpressError(`Item '${req.params.name}' not found`, 404);
		}
		return res.json(chosenItem);
	} catch (e) {
		return next(e);
	}
});

// PATCH /items/:name - modifies a single item's name and/or price
router.patch('/:name', function (req, res, next) {
	try {
		const chosenItem = global.items.find(
			(item) => item.name === req.params.name
		);
		if (!chosenItem) {
			throw new ExpressError(`Item '${req.params.name}' not found`, 404);
		}
		// Updates item's properties if provided in request body
		const { name, price } = req.body;
		if (name) chosenItem.name = name;
		if (price !== undefined) chosenItem.price = price;

		return res.json({ updated: chosenItem });
	} catch (e) {
		return next(e);
	}
});

// DELETE /items/:name - deletes a specific item from the array
router.delete('/:name', function (req, res, next) {
	try {
		const chosenItemIndex = global.items.findIndex(
			(item) => item.name === req.params.name
		);
		if (chosenItemIndex === -1) {
			throw new ExpressError(`Item '${req.params.name}' not found`, 404);
		}
		global.items.splice(chosenItemIndex, 1);
		return res.json({ message: 'Deleted' });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
