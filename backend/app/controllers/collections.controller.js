const db = require('../models');
const Collection = db.collections;

// Create a new collection
const createCollection = async (req, res) => {
    const { name, description, images } = req.body;
    try {
        const newCollection = await Collection.create({ name, description, images });
        res.status(201).json(newCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all collections
const getAllCollections = async (req, res) => {
    try {
        const collections = await Collection.find();
        res.status(200).json(collections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a collection by ID
const updateCollectionById = async (req, res) => {
    const { collectionId } = req.params;
    const { name, description, images } = req.body;
    try {
        const updatedCollection = await Collection.findByIdAndUpdate(collectionId, { name, description, images }, { new: true });
        if (!updatedCollection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.status(200).json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a collection by ID
const deleteCollectionById = async (req, res) => {
    const { collectionId } = req.params;
    try {
        await Collection.findByIdAndDelete(collectionId);
        res.status(200).json({ message: 'Collection deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCollection,
    getAllCollections,
    updateCollectionById,
    deleteCollectionById
};
