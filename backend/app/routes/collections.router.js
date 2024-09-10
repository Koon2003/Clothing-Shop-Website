// Description: Collections Router
const express = require('express');
const { getAllCollections, updateCollectionById, deleteCollectionById, createCollection } = require('../controllers/collections.controller');
const router = express.Router();

// Middleware
router.use((req, res, next) => {
    console.log("Request URL Courses: ", req.url);

    next();
});

//Create
router.post('/', createCollection);

//Get All
router.get('/', getAllCollections);

//Update
router.put('/:collectionId', updateCollectionById);

//Delete
router.delete('/:collectionId', deleteCollectionById);

module.exports = router;
