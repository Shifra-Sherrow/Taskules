import { httpService } from './http.service';
import { utilService } from './util.service';


export const boardService = {
    query,
    getById,
    remove,
    save,
    emptyBoard,
    emptyGroup,
    emptyCard,
    emptyActivity
};

function query(filter) {
    const filterStr = `?id=${filter}`
    return httpService.get(`board${filterStr}`);
}

function getById(boardId) {
    return httpService.get(`board/${boardId}`);
}

function remove(boardId) {
    return httpService.delete(`board/${boardId}`);
}

function save(board) {
    if (board._id) {
        return httpService.put(`board/${board._id}`, board);
    } else {
        return httpService.post(`board`, board);
    }
}

function emptyBoard() {
    return {
        "title": "Board",
        "byMember": {},
        "isPrivate": true,
        "style": {
            "background": ""
        },
        "members": [],
        "groups": [{
                "id": utilService.makeId() + '',
                "title": "To Do",
                "cards": [],
                "style": {
                    "headerColor": ""
                }
            },
            {
                "id": utilService.makeId() + '',
                "title": "In Progress",
                "cards": [],
                "style": {
                    "headerColor": ""
                }
            },
            {
                "id": utilService.makeId() + '',
                "title": "Done",
                "cards": [],
                "style": {
                    "headerColor": ""
                }
            }
        ],
        "activities": [],
        "labels": [{
                "id": "l101",
                "color": "#61bd4f",
                "title": "a"
            },
            {
                "id": "l102",
                "color": "#f2d600",
                "title": "b"
            },
            {
                "id": "l103",
                "color": "#ff9f1a",
                "title": "c"
            },
            {
                "id": "l104",
                "color": "#eb5a46",
                "title": "d"
            },
            {
                "id": "l105",
                "color": "#c377e0",
                "title": "e"
            },
            {
                "id": "l106",
                "color": "#0079bf",
                "title": "f"
            }
        ]
    }
}

function emptyGroup() {
    return {
        "id": utilService.makeId(),
        "title": "",
        "cards": [],
        "style": {
            "headerColor": "#ffffff"
        }
    }
}

function emptyCard() {
    return {
        "id": utilService.makeId(),
        "title": "",
        "description": "",
        "createdAt": "",
        "byMember": "",
        "style": {
            "headerColor": ""
        },
        "labels": []
    }
}

function emptyActivity() {
    return {
        id: utilService.makeId(),
        txt: '',
        createdAt: '',
        comment: '',
        byMember: {
            _id: '',
            username: '',
            imgUrl: ''
        },
        card: {
            id: '',
            title: '',
            url: ''
        }
    }
}