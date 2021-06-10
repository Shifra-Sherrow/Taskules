const express = require('express');
const { getBoards, getBoard, deleteBoard, addBoard, updateBoard } = require('./board.controller');
const router = express.Router();

router.get('/', getBoards);
router.get('/:id', getBoard);
router.delete('/:id', deleteBoard);
router.post('/', addBoard);
router.put('/:id', updateBoard);

module.exports = router;