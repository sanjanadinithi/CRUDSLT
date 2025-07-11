const express = require('express');
const routes = express.Router();
const Book = require('../Models/Book');

// create
routes.post('/', async (req , res) => {
    const newBook = new Book(req.body);
    try {
        const saveBook = await newBook.save();
        res.status(201).json(saveBook);
        
    } catch (error) {
        res.status(400).json({message : error.message});
        
    }
});

//read
routes.get('/',async(req, res) =>{
    try {
        const book = await Book.find();
    res.json(book);
        
    } catch (error) {
        res.status(500).json({message : error.message});
    }
    

});

//update
routes.put('/:id', async(req, res) => {
    try {
        const updateBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body
        );
        res.json(updateBook);
    } catch (error) {
        res.status(400).json({message : error.message});
    }

});

//detet
routes.delete('/:id', async(req, res) =>{
    try {
        const detetBook =await Book.findByIdAndDelete(
            req.params.id,
        );
        res.json({message : "Book detete !"});
    } catch (error) {
        res.status(500).json({message : error.message});
    }
});

module.exports = routes;