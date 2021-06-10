<template>
    <section v-if="board" class="board-details flex f-col">
        <!-- <div class="screen" @click="goBack"></div> -->
        <board-header
            :board="board"
            :users="users"
            :user="user"
            @openMenu="toggleMenu"
            @updateTitle="updateBoardTitle"
            @updateboardUsers="updateboardUsers"
            @changeBgc="changeBgc"
            @privacyChange="changePrivacy"
            @filter="filter"
            @markBoard="markBoard"
        />
        <div v-if="cardToEdit" class="window" @click="closeCardToEdit">
            <card-menu-edit
                @click.stop.native
                @updateMembers="updateMembers"
                @updateCardTitle="updateCardTitle"
                @updateCardLabel="updateCard"
                @updateLabelTitle="updateLabelTitle"
                @moveCard="moveCard"
                @updateCard="updateCard"
                @updateActivities="addActivity"
                @isEditing="setIsEditing"
                :clickPos="clickPos"
                :board="board"
                :currCard="cardToEdit"
                :loggedinUser="user"
            />
        </div>
        <div
            class="flex group-container"
            v-if="board"
            v-dragscroll:firstchilddrag
        >
            <draggable
                handle=".handle"
                v-dragscroll:nochilddrag
                class="drag-area flex"
                ghostClass="ghost"
                chosenClass="chosen"
                dragClass="drag"
                draggableSelector="div"
                :list="board.groups"
                :animation="200"
                :group="'board'"
                :forceFallback="true"
                @change="updateBoard(board)"
            >
                <group
                    data-no-dragscroll
                    v-for="(group, idx) in board.groups"
                    :key="group.id"
                    :group="group"
                    :board="board"
                    :groupIdx="idx"
                    :labels="board.labels"
                    :activities="board.activities"
                    :filterBy="filterBy"
                    :clickPos="clickPos"
                    @close="closeDetails"
                    @newCard="addCard"
                    @change="updateGroup"
                    @delete="deleteGroup"
                    @moveGroup="moveGroup"
                    @addClone="addGroupClone"
                    @updateGroup="updateGroup"
                    @openEditCard="openEditCard"
                    @moveCardOnDrag="moveCardOnDrag"
                />
            </draggable>

            <div class="add-group-container group" @click.stop>
                <div class="title-area" v-if="isAddingGroup">
                    <input
                        @keydown.enter.prevent
                        @keyup.enter="newGroup"
                        ref="group-title"
                        placeholder="Enter list title..."
                        type="text"
                        v-model="newGroupTitle"
                        maxlength="80"
                    />
                    <div class="add-group-btns flex">
                        <button @click="newGroup" class="add-btn">
                            Add List
                        </button>
                        <i
                            class="el-icon-close close-btn"
                            @click="closeAddGroup"
                        ></i>
                    </div>
                </div>
                <div v-else class="open-add-btn" @click.stop="addGroup">
                    <i class="el-icon-plus"></i> <span> Add another list</span>
                </div>
            </div>
            <div class="spacer">x</div>
        </div>
        <div class="window" v-if="isDetails" @click="closeDetails">
            <card-details
                @close="closeDetails"
                @addCard="updateCard"
                @deleteCard="deleteCard"
            />
        </div>
        <!-- <div class="window" @click="closeDashboard">
            <dashboard :board="this.board" :colors="colors"/>
        </div> -->
        <!-- v-show="isMenu" -->
        <board-menu
            :board="board"
            :class="{ isOut: !isMenu }"
            @changeBgc="changeBgc"
            @close="toggleMenu"
            @deleteBoard="deleteBoard"
            @filter="filter"
            @deleteComment="deleteComment"
        />
    </section>
</template>

<script>
import draggable from 'vuedraggable'
import group from '../cmps/board/group.cmp';
import boardHeader from '../cmps/board/board-header.cmp';
import cardDetails from '@/views/card-details';
import boardMenu from '../cmps/board/menu/board-menu.cmp';
import cardMenuEdit from '@/cmps/card/card-menu-edit.cmp';
// import dashboard from '@/cmps/dashboard.cmp'
import { utilService } from '@/services/util.service';
import { socketService } from '@/services/socket.service';
const Swal = require('sweetalert2');

export default {
    data() {
        return {
            isDetails: false,
            isAddingGroup: false,
            isMenu: false,
            isCardEdit: false,
            // isDashboard: false,
            newGroupTitle: '',
            filterBy: null,
            cardToEdit: null,
            clickPos: {},
        }
    },
    computed: {
        // colors(){
        //     return this.$store.getters.colors;
        // },
        board() {
            // if (this.$store.getters.currBoard) {
            // 	socketService.emit('set-board', this.$store.getters.currBoard._id)
            // }
            return utilService.deepCopy(this.$store.getters.currBoard);
        },
        users() {
            return this.$store.getters.users;
        },
        user() {
            return this.$store.getters.loggedinUser;
        },
        boardStyle() {
            return { 'background': `${this.board.style.background}` }
        },

    },
    methods: {
        moveCard(status, card) {
            this.$store.commit({ type: 'updateCardStatus', status });
            const board = this.board;
            this.updateBoard(board);
            this.cardToEdit = false;
            if (status.startGroup !== status.endGroup) {
                const groupTitle = board.groups.find(group => group.id === status.endGroup).title;
                const loggedinUser = this.$store.getters.loggedinUser;
                const msg = status.isClone ? `${loggedinUser.username} cloned card '${card.title}' to list '${groupTitle}'` : `${loggedinUser.username} moved card '${card.title}' to list '${groupTitle}'`;
                const alertMsg = status.isClone ? 'Card was successfully cloned' : 'Card was successfully moved';
                socketService.emit('change-board', { msg, boardId: board._id, members: this.members(loggedinUser) });
                this.myAlert(alertMsg);
                this.addActivity(`moved card '${card.title}' to '${groupTitle}'`, card, null, card);
            }

        },
        updateLabelTitle(labelId, title) {
            const board = this.board;
            const idx = board.labels.findIndex(label => label.id === labelId);
            if (idx !== -1) board.labels[idx].title = title;
            this.updateBoard(board);
        },
        updateCardTitle(title, card) {
            let updateCard = utilService.deepCopy(card)
            updateCard.title = title;
            this.updateCard(updateCard);
            this.cardToEdit = null;
        },
        toggleMenu() {
            this.isMenu = !this.isMenu;
        },
        closeDetails() {
            this.isDetails = false;
            this.$router.push(`/board/${this.board._id}`)
        },
        closeCardToEdit() {
            this.cardToEdit = null;
        },
        addCard(title, groupId) {
            const newCard = this.getEmptyCard();
            newCard.title = title;
            newCard.byMember = this.$store.getters.loggedinUser;
            newCard.createdAt = Date.now();
            const board = this.board;
            const group = this.board.groups.find(group => group.id === groupId);
            group.cards.push(newCard);
            this.updateBoard(board);
            const loggedinUser = this.$store.getters.loggedinUser;
            socketService.emit('change-board', { msg: `${loggedinUser.username} added card '${title}'`, boardId: board._id, members: this.members(loggedinUser) });
            this.myAlert('The card was successfully added');
            this.addActivity(` added `, newCard)
        },
        updateCard(card) {
            const board = this.board;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === card.id);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1, card);
            })
            this.updateBoard(board);
        },
        deleteCard(cardId) {
            const board = this.board;
            let cardTitle;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === cardId);
                if (cardIdx !== -1) {
                    cardTitle = group.cards[cardIdx].title;
                    group.cards.splice(cardIdx, 1);
                }
            })
            this.updateBoard(board);
            this.addActivity(`deleted the card '${cardTitle}'`)
        },
        updateGroup(group) {
            const board = this.board;
            const groupIdx = board.groups.findIndex(currGroup => currGroup.id === group.id);
            board.groups.splice(groupIdx, 1, group);
            this.updateBoard(board);
        },
        deleteGroup(groupId) {
            const board = this.board;
            const groupIdx = board.groups.findIndex(currGroup => currGroup.id === groupId);
            const loggedinUser = this.$store.getters.loggedinUser;
            socketService.emit('change-board', { msg: `${loggedinUser.username} deleted list '${board.groups[groupIdx].title}'`, boardId: board._id, members: this.members(loggedinUser) });
            board.groups.splice(groupIdx, 1);
            this.updateBoard(board);
            this.myAlert('The list was successfully deleted');
            this.addActivity('deleted a list')
        },
        newGroup() {
            if (!this.newGroupTitle) return;
            const newGroup = this.getEmptyGroup();
            newGroup.title = this.newGroupTitle;
            const board = this.board;
            board.groups.push(newGroup);
            this.updateBoard(board);
            this.newGroupTitle = '';
            setTimeout(() => {
                this.$refs['group-title'].focus();
                this.$refs['group-title'].scrollIntoView();
            }, 10);
            const loggedinUser = this.$store.getters.loggedinUser;
            socketService.emit('change-board', { msg: `${loggedinUser.username} added list '${newGroup.title}'`, boardId: board._id, members: this.members(loggedinUser) });
            this.myAlert('The list was successfully added');
            this.addActivity('added a list')

        },
        addGroup() {
            this.isAddingGroup = true;
            setTimeout(() => { this.$refs['group-title'].focus() }, 10);
        },
        moveGroup(from, to) {
            const board = utilService.deepCopy(this.board);
            const group = board.groups.splice(from, 1)
            board.groups.splice(to - 1, 0, group[0])
            this.updateBoard(board)
        },
        addGroupClone(group) {
            const board = this.board;
            board.groups.push(group);
            this.updateBoard(board)
            this.addActivity(`added a clone of the list ${group.title}`)

        },
        getEmptyCard() { //maybe get from service direct
            this.$store.commit('setEmptyCard');
            return this.$store.getters.emptyCard;
        },
        getEmptyGroup() {
            this.$store.commit('setEmptyGroup');
            return this.$store.getters.emptyGroup;
        },
        closeAddGroup() {
            this.isAddingGroup = false;
            this.newGroupTitle = '';
        },
        updateBoard(board) {
            this.$store.dispatch({ type: 'updateBoard', board });
            socketService.emit('update-board', board);
        },
        updateboardUsers(userId) {
            const board = this.board;
            const memberIdx = board.members.findIndex(member => member._id === userId);
            const user = this.$store.getters.users.find(user => user._id === userId);
            if (memberIdx === -1) {
                const boardUser = {
                    _id: user._id,
                    username: user.username,
                    imgUrl: user.imgUrl
                };
                board.members.push(boardUser);
            } else {
                board.members.splice(memberIdx, 1);
                board.groups.forEach(group => {
                    group.cards.forEach(card => {
                        const currMemberIdx = card.members.findIndex(member => member._id === userId)
                        if (currMemberIdx !== -1) card.members.splice(currMemberIdx, 1);
                    })
                })
            }
            this.updateBoard(board);
            const loggedinUser = this.$store.getters.loggedinUser;
            const msg = memberIdx === -1 ? `${user.username} was added to this board` : `${user.username} was removed from this board`;
            const alertMsg = memberIdx === -1 ? `${user.username} was successfully added` : `${user.username} was successfully removed`;
            socketService.emit('change-board', { msg, members: this.members(loggedinUser) });
            this.myAlert(alertMsg);
            const action = (memberIdx === -1) ? `added ${user.username} to the board` : `removed ${user.username} from the board`;
            this.addActivity(action);

        },
        updateMembers(userId, card) {
            const memberIdx = card.members.findIndex(member => member._id === userId);
            const newUser = this.$store.getters.users.find(user => user._id === userId);
            if (memberIdx === -1) {
                const newMember = {
                    _id: newUser._id,
                    username: newUser.username,
                    imgUrl: newUser.imgUrl
                };
                card.members.push(newMember);
            } else {
                card.members.splice(memberIdx, 1);
            }
            this.updateCard(card);
            const loggedinUser = this.$store.getters.loggedinUser;
            const msg = memberIdx === -1 ? `${newUser.username} was added to card '${card.title}'` : `${newUser.username} was removed from card '${card.title}'`;
            const alertMsg = memberIdx === -1 ? `${newUser.username} was successfully added` : `${newUser.username} was successfully removed`;
            socketService.emit('change-board', { msg, members: this.members(loggedinUser) });
            this.myAlert(alertMsg);
            const action = (memberIdx === -1) ? `added ${newUser.username} to ` : `removed ${newUser.username} from`;
            this.addActivity(action, card, null, this.loggedinUser)
        },
        updateBoardTitle(boardTitle) {
            const board = this.board;
            board.title = boardTitle;
            this.updateBoard(board);
        },
        changeBgc(bgc) {
            this.$store.commit({ type: 'bgChange', bgc })
            const board = utilService.deepCopy(this.board);
            board.style.background = bgc;
            this.updateBoard(board);
        },
        changePrivacy(privacy) {
            const board = utilService.deepCopy(this.board);
            board.isPrivate = (privacy === 'private');
            this.updateBoard(board)
            const loggedinUser = this.$store.getters.loggedinUser;
            socketService.emit('change-board', { msg: `${loggedinUser.username} changed the board privacy to ${privacy}`, boardId: board._id, members: this.members(loggedinUser) });
            this.myAlert('Privacy was successfully changed');
            this.addActivity(`changed the board privacy to ${privacy}`)
        },
        deleteBoard(boardId) {
            this.$store.dispatch('deleteBoard', boardId);
            setTimeout(() => { this.$router.push('/board'); }, 200)
        },
        addActivity(txt, card, comment = null, user = this.user) {
            this.$store.commit('setEmptyActivity');
            const activity = utilService.deepCopy(this.$store.getters.emptyActivity);
            activity.txt = txt;
            activity.comment = comment;
            activity.byMember = utilService.deepCopy(user);
            activity.createdAt = Date.now();
            if (card) activity.card = {
                id: card.id,
                title: card.title,
            }
            const board = this.board;
            board.activities.unshift(activity);
            this.updateBoard(board);
        },
        deleteComment(commentId) {
            const board = this.board;
            const commIdx = board.activities.findIndex(activity => activity.id === commentId)
            board.activities.splice(commIdx, 1);
            this.updateBoard(board);
        },
        filter(filterBy) {
            this.filterBy = filterBy
        },
        updateBoardSocket(board) {
            this.$store.dispatch({ type: 'updateBoard', board });
        },
        openEditCard(currCard) {
            this.cardToEdit = currCard;
            // this.isCardEdit = true;
        },
        setClickPos({ x, y, offsetX, offsetY, target }) {
            if (this.isCardEdit) return
            const imgOffsetX = (target.name === 'edit') ? 8 : 0;
            const imgOffsetY = (target.name === 'edit') ? 8 : 0;
            const isScroll = (target.dataset.scroll) ? true : null;
            const pos = { x, y, width: window.innerWidth, height: window.innerHeight, offsetX: offsetX + imgOffsetX, offsetY: offsetY + imgOffsetY, isScroll }
            this.clickPos = pos;
        },
        setIsEditing(val) {
            this.isCardEdit = val;
        },
        // closeDashboard() {
        //     this.isDashboard = false;
        // },
        moveCardOnDrag(groupTitle, card) {
            const loggedinUser = this.$store.getters.loggedinUser;
            socketService.emit('change-board', { msg: `${loggedinUser.username} moved card '${card.title}' to list '${groupTitle}'`, members: this.members(loggedinUser) });
            this.myAlert('Card was successfully moved');
            this.addActivity(`moved card '${card.title}' to '${groupTitle}'`, card, null, loggedinUser);
        },
        members(loggedinUser) {
            let members = this.board.members.map(member => member._id);
            members.push(this.board.byMember._id);
            members = members.filter(memberId => memberId !== loggedinUser._id);
            return members;
        },
        myAlert(title) {
            Swal.fire({
                position: 'bottom-end',
                title,
                showConfirmButton: false,
                timer: 2500
            });
        },
        markBoard() {
            const board = this.board
            board.isMarked = (board.isMarked) ? false : true;
            this.updateBoard(board)
        }
    },
    watch: {
        '$route.params'() {
            if (this.$route.params.cardId) {
                this.isDetails = true;
            }
            else this.isDetails = false
        },
        '$store.getters.loggedinUser'() {
            if (this.$store.getters.loggedinUser._id === 'guest' && this.board.isPrivate) this.$router.push('/board')
        }
    },
    created() {
        this.$store.dispatch('loadUsers');
        if (this.$route.params.cardId) this.isDetails = true;
        const boardId = this.$route.params.boardId;
        this.$store.dispatch({ type: 'loadBoard', boardId });
        setTimeout(() => {
            if (this.$store.getters.loggedinUser._id === 'guest' && this.board.isPrivate) this.$router.push('/board')
        }, 500)
        socketService.emit('set-board', boardId);
        socketService.on('board-update', this.updateBoardSocket);
        document.addEventListener('click', (ev) => {
            this.setClickPos(ev);
            this.closeAddGroup();
        })
    },
    destroyed() {
        document.removeEventListener('click', (ev) => {
            this.setClickPos(ev);
            this.closeAddGroup();
        })
        socketService.off('board-update', this.updateBoardSocket);
        this.$store.dispatch({ type: 'loadBoard', boardId: null });
    },
    components: {
        group,
        boardHeader,
        cardDetails,
        draggable,
        boardMenu,
        cardMenuEdit,
        // dashboard
    }
}
</script>

