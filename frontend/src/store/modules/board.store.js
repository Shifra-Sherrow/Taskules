import { boardService } from '../../services/board.service.js';
import { utilService } from '../../services/util.service.js'

export default {
    state: {
        boards: null,
        currBoard: null,
        emptyGroup: null,
        emptyActivity: null,
        currCard: null,
        emptyCard: null,
    },
    getters: {
        boards(state) {
            return utilService.deepCopy(state.boards);
        },
        currBoard(state) {
            return state.currBoard;
        },
        emptyGroup(state) {
            return state.emptyGroup;
        },
        emptyActivity(state) {
            return state.emptyActivity
        },
        currCard(state) {
            return state.currCard;
        },
        emptyCard(state) {
            return state.emptyCard;
        },
        activities(state) {
            return state.currCard.activities;
        }
    },
    mutations: {
        setBoards(state, boards) {
            state.boards = boards;
        },
        deleteBoard(state, boardId) {
            const idx = state.boards.findIndex(board => board._id === boardId);
            state.boards.splice(idx, 1);
        },
        addNewBoard(state, newBoard) {
            state.boards.push(newBoard);
        },
        updateBoard(state, { board }) {
            state.currBoard = board;
        },
        setEmptyGroup(state) {
            const group = utilService.deepCopy(boardService.emptyGroup());
            state.emptyGroup = group;
        },
        setEmptyActivity(state) {
            const activity = utilService.deepCopy(boardService.emptyActivity());
            state.emptyActivity = activity;
        },
        setCurrCard(state, { cardId }) {
            state.currBoard.groups.forEach(group => {
                const card = group.cards.find(card => {
                    return card.id === cardId
                });
                if (card) {
                    state.currCard = card;
                }
            })
        },
        updateCurrCard(state, { card }) {
            state.currCard = card;
        },
        setEmptyCard(state) {
            const card = utilService.deepCopy(boardService.emptyCard());
            state.emptyCard = card
        },
        updateCardStatus(state, { status }) {
            if ((status.startGroup === status.endGroup && status.endPos === status.startPos) || (status.startGroup === status.endGroup && (!status.endPos && status.endPos !== 0))) return;
            if (status.cardId) {
                state.currBoard.groups.forEach(group => {
                    const card = group.cards.find(card => card.id === status.cardId)
                    if (card) state.currCard = card;
                });
            }
            let cardToMove;
            const board = state.currBoard;
            const startGroupIdx = board.groups.findIndex(group => group.id === status.startGroup);
            if (!status.isClone) {
                cardToMove = state.currCard;
                board.groups[startGroupIdx].cards.splice(status.startPos, 1);
            } else {
                cardToMove = utilService.deepCopy(state.currCard);
                cardToMove.id = utilService.makeId();
            }
            const endGroupIdx = board.groups.findIndex(group => group.id === status.endGroup);
            if (!status.endPos && status.endPos !== 0) {
                board.groups[endGroupIdx].cards.push(cardToMove);
            } else board.groups[endGroupIdx].cards.splice(status.endPos, 0, cardToMove);
            // if (status.cardId) {
            //     state.currCard = null;
            // }
            return
        },
    },
    actions: {
        async loadBoards({ commit }) {
            const boards = await boardService.query(this.getters.loggedinUser._id)
            commit('setBoards', boards)
        },
        async loadBoard({ commit }, { boardId }) {
            let board;
            if (!boardId) board = null;
            else board = await boardService.getById(boardId)
            commit({ type: 'updateBoard', board })
            commit('loadBgc')
        },
        async updateBoard({ commit }, { board }) {
            commit({ type: 'updateBoard', board })
            return await boardService.save(board);
        },
        async deleteBoard({ commit }, boardId) {
            await boardService.remove(boardId);
            commit({ type: 'deleteBoard', boardId });
        },
        async createNewBoard(context) {
            const newBoard = boardService.emptyBoard();
            const user = context.getters.loggedinUser;
            if (user._id === 'guest') newBoard.isPrivate = false;
            newBoard.byMember = user;
            const activity = boardService.emptyActivity();
            activity.byMember = user;
            activity.createdAt = Date.now();
            activity.txt = 'created the board';
            delete activity.card;
            newBoard.activities.push(activity);
            const savedBoard = await boardService.save(newBoard);
            context.commit('addNewBoard', savedBoard);
            return savedBoard;
        },
        // async createNewBoard(context, newBoardTxt) {
        //     const newBoard = boardService.emptyBoard();
        //     const user = context.getters.loggedinUser;
        //     newBoard.title = newBoardTxt;
        //     if (user._id === 'guest') newBoard.isPrivate = false;
        //     newBoard.byMember = user;
        //     const activity = boardService.emptyActivity();
        //     activity.byMember = user;
        //     activity.createdAt = Date.now();
        //     activity.txt = 'created the board';
        //     delete activity.card;
        //     newBoard.activities.push(activity);
        //     const savedBoard = await boardService.save(newBoard);
        //     context.commit('addNewBoard', savedBoard);
        //     return savedBoard;
        // },

    }
}