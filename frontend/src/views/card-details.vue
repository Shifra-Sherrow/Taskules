<template>
    <section
        v-if="card"
        class="card-details flex f-col"
        @click.stop="closePopup"
    >
        <div
            class="card-header"
            :style="headerStyle"
            v-if="card.style.headerColor"
        ></div>
        <button
            class="exit-btn flex f-center"
            @click.stop="emitClose"
            :class="{ cover: this.card.style.headerColor }"
        >
            <i class="el-icon-close"></i>
        </button>
        <div
            class="card-main-container"
            :class="{ cover: this.card.style.headerColor }"
        >
            <!-- INFO -->
            <div class="card-info">
                <div class="info">
                    <span class="card-icon">
                        <img src="@/assets/svg/card.svg" />
                    </span>
                    <input
                    v-autowidth="{
                    maxWidth: '960px',
                    minWidth: '20px',
                    comfortZone: 30,
                }"
                        ref="card-title"
                        class="title"
                        type="text"
                        v-model="card.title"
                        @blur="updateCardTitle"
                        @keyup.enter="updateCardTitle"
                    />
                    <h4 class="in-list">
                        In list <span>{{ getCurrGroup.title }}</span>
                    </h4>
                </div>
                <section class="add-to-card flex wrap">
                    <div
                        class="card-members f-col"
                        v-if="card.members && card.members.length"
                    >
                        <h3>Members</h3>
                        <div class="flex wrap">
                            <span
                                v-for="member in card.members"
                                :key="member._id"
                            >
                                <custom-avatar
                                    class="avatar"
                                    :size="40"
                                    :username="member.username"
                                    :src="member.imgUrl"
                                    :style="{ fontSize: '12px' }"
                                />
                            </span>
                            <span @click.stop="onAddMembers">
                                <custom-avatar
                                    class="card-details-btn plus-btn member"
                                    :size="40"
                                    :isAdd="true"
                                />
                            </span>
                            <!-- <button
								class="card-details-btn plus-btn member flex f-center"
								@click.stop="onAddMembers"
							>
								+
							</button> -->
                        </div>
                    </div>
                    <div
                        class="label-marks f-col"
                        v-if="card.labels && labelsSelected.length"
                    >
                        <h3 class="flex">Labels</h3>
                        <div class="label-container flex wrap">
                            <div
                                v-for="label in labelsSelected"
                                :key="label.id"
                                class="label flex f-center"
                                :style="{ backgroundColor: label.color }"
                            >
                                {{ label.title }}
                            </div>
                            <button
                                class="card-details-btn plus-btn flex f-center"
                                @click.stop="openLabels"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div class="due-date" v-if="card.dueDate || dueDate">
                        <h3>Due Date</h3>
                        <span class="due-date-info" v-if="card.dueDate">
                            <el-checkbox
                                class="checkbox"
                                v-model="card.isComplete"
                                @change="toggleIsComplete"
                            ></el-checkbox>
                            <span
                                class="card-details-btn due-date-local-time"
                                @click.stop="setDate"
                                >{{ moment(card.dueDate).format("MMM Do")
                                }}<span v-if="card.isComplete" class="complete">
                                    complete
                                </span>
                                <span class="over-due" v-else-if="isOverDue">
                                    overdue
                                </span>
                            </span>
                        </span>
                        <date-picker
                            @click.stop
                            ref="date-picker"
                            class="date-picker"
                            slot="date-picker"
                            :dueDate="card.dueDate"
                            v-if="dueDate"
                            @setDate="setNewDate"
                        />
                    </div>
                </section>
                <div class="description flex">
                    <span class="card-icon">
                        <img src="@/assets/svg/desc.svg" />
                    </span>
                    <card-description
                        :description="card.description"
                        @updateDesc="updateDesc"
                    />
                </div>
                <!-- <img
					v-if="isLoading"
					class="loading-gif"
					src="../assets/animations/load.gif"
					alt="Loading"
				/> -->
                <div
                    v-if="attachments && attachments.length"
                    class="attachments-group flex"
                >
                    <span class="card-icon">
                        <img src="@/assets/svg/attach.svg" />
                    </span>

                    <div v-if="attachments" class="attachments-content">
                        <h2>Attachments</h2>
                        <card-attachments
                            :attachments="attachments"
                            :isLoading="isLoading"
                            @updateAttachments="updateAttachments"
                        />
                    </div>
                </div>
                <div v-if="card.checklistGroup" class="checklist-group">
                    <div
                        class="checklist flex"
                        v-for="checklist in card.checklistGroup"
                        :key="checklist.id"
                    >
                        <span class="card-icon">
                            <img src="@/assets/svg/checklist.svg" />
                        </span>

                        <card-checklist
                            :checklist="checklist"
                            @updeteChecklist="updeteChecklist"
                            @deleteChecklist="deleteChecklist"
                        />
                    </div>
                </div>
                <div class="activity flex">
                    <span class="card-icon activity-icon">
                        <img src="@/assets/svg/activities.svg" />
                    </span>

                    <card-activity
                        v-if="card"
                        :user="loggedinUser"
                        :activities="cardActivities"
                        :isShowDetails="false"
                        :card="card"
                        ref="activity"
                        @addComment="addActivity"
                        @deleteComment="deleteComment"
                    />
                </div>
            </div>
            <!-- ACTIONS -->
            <div class="actions flex f-col">
                <h3 class="add-to-card-title">Add to card</h3>
                <button
                    @click.stop="onAddMembers"
                    class="flex f-a-center content-after action-btn"
                    title="Members"
                    data-txt="Members"
                    aria-label="Members"
                >
                    <img
                        class="icon-btn"
                        src="@/assets/svg/member.svg"
                        alt=""
                    />
                    <pop-up v-if="isCmpOpen('member')" @closePopup="closePopup"
                        ><add-members
                            :cardMembers="cardMembers()"
                            :boardMembers="boardMembers"
                            @updateMembers="updateMembers"
                        />
                    </pop-up>
                </button>
                <button
                    @click.stop="openLabels"
                    class="flex f-a-center content-after action-btn"
                    title="Labels"
                    data-txt="Labels"
                    aria-label="Labels"
                >
                    <img class="icon-btn" src="@/assets/svg/label.svg" />
                    <pop-up
                        v-if="board && isCmpOpen('labels')"
                        @closePopup="closePopup"
                    >
                        <card-labels
                            :card="card"
                            :boardLabels="board.labels"
                            @updateCard="updateCard"
                            @updateLabelTitle="updateLabelTitle"
                        />
                    </pop-up>
                </button>
                <button
                    @click.stop="addChecklist"
                    class="flex f-a-center content-after action-btn"
                    title="Checklist"
                    data-txt="Checklist"
                    aria-label="Checklist"
                >
                    <img
                        class="icon-btn"
                        src="@/assets/svg/checklist.svg"
                        alt=""
                    />
                    <pop-up
                        v-if="isCmpOpen('checklist')"
                        @closePopup="closePopup"
                    >
                        <add-checklist
                            :card="card"
                            @updateCard="updateCard"
                            @close="closePopup"
                        />
                    </pop-up>
                </button>
                <button
                    @click="startUpload"
                    class="upload-btn flex f-a-center content-after action-btn"
                    data-txt="Attachments"
                    aria-label="Attachments"
                >
                    <img class="icon-btn" src="@/assets/svg/attach.svg" />
                </button>
                <input
                    ref="upload"
                    class="upload"
                    type="file"
                    name="uploader"
                    id="uploader"
                    @change="onUpload"
                />
                <button
                    class="cover-btn flex f-a-center content-after action-btn"
                    title="Cover"
                    data-txt="Cover"
                    aria-label="Cover"
                    @click.stop="openCoverPicker"
                >
                    <img class="icon-btn" src="@/assets/svg/cover.svg" />
                    <pop-up v-if="isCmpOpen('cover')" @closePopup="closePopup">
                        <card-cover
                            :color="card.style.headerColor"
                            :showFull="card.style.isFull"
                            @colorChange="updateCover"
                    /></pop-up>
                </button>
                <button
                    @click.stop="setDate"
                    class="flex f-a-center content-after action-btn"
                    title="Set Date"
                    data-txt="Set Date"
                    aria-label="Set Date"
                >
                    <img class="icon-btn" src="@/assets/svg/clock.svg" />
                </button>
                <button
                    @click.stop="removeDate"
                    v-if="card.dueDate"
                    class="remove-date flex f-a-center content-after action-btn"
                    title="Remove Date"
                    data-txt="Remove Date"
                    aria-label="Remove Date"
                >
                    <i class="fal fa-history"></i>
                </button>
                <h3 class="actions-title">Actions</h3>
                <button
                    @click.stop="cloneCard"
                    class="flex f-a-center content-after action-btn"
                    title="Clone"
                    data-txt="Clone"
                    aria-label="Clone"
                >
                    <img
                        class="icon-btn clone-img"
                        src="@/assets/svg/clone.svg"
                    />
                    <!-- <i class="fal fa-clone"></i> -->
                    <pop-up v-if="isCmpOpen('clone')" @closePopup="closePopup">
                        <card-move
                            :isClone="true"
                            :groups="board.groups"
                            :group="getCurrGroup"
                            :currPosition="getCurrPosition"
                            @moveCard="moveCard"
                    /></pop-up>
                </button>
                <button
                    class="dlt-btn flex f-a-center content-after action-btn"
                    title="Delete"
                    data-txt="Delete Card"
                    aria-label="Delete Card"
                    @click.stop="deleteCard"
                >
                    <i class="fal fa-trash-alt"></i>
                </button>
                <button
                    class="move-btn flex f-a-center content-after action-btn"
                    title="Move"
                    data-txt="Move"
                    aria-label="Move"
                    @click.stop="emitMove"
                >
                    <img class="icon-btn" src="@/assets/svg/move.svg" />
                    <pop-up v-if="isCmpOpen('move')" @closePopup="closePopup">
                        <card-move
                            :isClone="false"
                            :groups="board.groups"
                            :group="getCurrGroup"
                            :currPosition="getCurrPosition"
                            @moveCard="moveCard"
                    /></pop-up>
                </button>
            </div>
        </div>
        <div v-if="isLoading" class="window">
            <div class="sk-cube-grid">
                <div class="sk-cube sk-cube1"></div>
                <div class="sk-cube sk-cube2"></div>
                <div class="sk-cube sk-cube3"></div>
                <div class="sk-cube sk-cube4"></div>
                <div class="sk-cube sk-cube5"></div>
                <div class="sk-cube sk-cube6"></div>
                <div class="sk-cube sk-cube7"></div>
                <div class="sk-cube sk-cube8"></div>
                <div class="sk-cube sk-cube9"></div>
            </div>
        </div>
    </section>
</template>

<script>
import { utilService } from '@/services/util.service';
import { uploadImg } from '@/services/img-upload.service';
import { socketService } from '@/services/socket.service'
// import checkBox from '../cmps/custom-elements/check-box.cmp';
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'
import datePicker from '@/cmps/custom-elements/date-picker.cmp';
import addMembers from '@/cmps/custom-elements/add-members.cmp';
import popUp from '../cmps/card/card-details/pop-up.cmp';
import cardActivity from '@/cmps/card/card-details/card-activity.cmp';
import cardAttachments from '@/cmps/card/card-details/card-attachments.cmp';
import cardMove from '@/cmps/card/card-details/card-move.cmp';
import cardCover from '@/cmps/card/card-details/card-cover.cmp';
import cardLabels from '@/cmps/card/card-details/card-labels.cmp';
import addChecklist from '../cmps/card/card-details/add-checklist.cmp';
import cardChecklist from '../cmps/card/card-details/card-checklist.cmp';
import cardDescription from '../cmps/card/card-details/card-description.cmp';
const Swal = require('sweetalert2');

export default {
    data() {
        return {
            card: null,
            isPopUp: false,
            currPopUp: null,
            isLoading: false,
        }
    },
    computed: {
        loggedinUser() {
            return this.$store.getters.loggedinUser;
        },
        boardMembers() {
            const membersToShow = utilService.deepCopy(this.board.members);
            membersToShow.push(utilService.deepCopy(this.board.byMember));
            return membersToShow
        },
        board() {
            return utilService.deepCopy(this.$store.getters.currBoard);
        },
        getCurrGroup() {
            const group = this.board.groups.find(group => group.cards.some(card => card.id === this.card.id));
            return group;
        },
        getCurrPosition() { //get rid of get
            return this.getCurrGroup.cards.findIndex(card => card.id === this.card.id) + 1;
        },
        dueDate() {
            return this.currPopUp === 'duedate';
        },
        isCmpOpen() {
            return (cmpName) => this.isPopUp && this.currPopUp === cmpName;
        },
        headerStyle() {
            return { background: this.card.style.headerColor };
        },
        attachments() {
            return this.card.attachments;
        },
        cardActivities() {
            return this.board.activities.filter(activity => {
                if (activity.card) {
                    if (activity.card.id === this.card.id) return activity
                }
            })
        },
        labelsSelected() {
            const selectIds = this.card.labels.map(label => label.id);
            return this.board.labels.filter(label => selectIds.includes(label.id));
        },
        isOverDue() {
            return this.card.dueDate < Date.now();
        }
    },
    methods: {
        updateCardTitle() {
            this.$refs['card-title'].blur();
            this.updateBoard();
        },
        updateBoard(board = this.board) {
            this.$store.dispatch({ type: 'updateBoard', board });
            socketService.emit('update-card', this.card)
            socketService.emit('update-board', board)
        },
        updateCard(card = this.card) {
            const board = this.board;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === card.id);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1, card);
            })
            this.updateBoard(board);
            this.card = card;
        },
        updateCardSocket(card) {
            const board = this.board;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === card.id);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1, card);
            })
            this.$store.dispatch({ type: 'updateBoard', board });
            this.card = card;
        },
        addActivity(txt, card, comment = null, user = this.loggedinUser) {
            this.$store.commit('setEmptyActivity');
            const activity = utilService.deepCopy(this.$store.getters.emptyActivity);
            activity.txt = txt;
            activity.comment = comment;
            activity.byMember = utilService.deepCopy(user);
            activity.createdAt = Date.now();
            if (card) {
                activity.card = {
                    id: card.id,
                    title: card.title,
                }
            }
            const board = this.board;
            board.activities.unshift(activity);
            this.updateBoard(board);
        },
        deleteComment(commentId){
            const board = this.board;
            const commIdx = board.activities.findIndex(activity => activity.id === commentId)
            board.activities.splice(commIdx , 1);
            this.updateBoard(board);
        },
        closePopup(ev) {
            this.isPopUp = false;
            this.currPopUp = '';
            if (ev && ev.target.name !== 'comment') this.$refs.activity.closeInput();
            return
        },
        emitClose() {
            this.$emit('close');
        },
        cloneCard() {
            this.currPopUp = 'clone';
            this.isPopUp = true;
            // const cardCopy = utilService.deepCopy(this.card);
            // cardCopy.id = utilService.makeId();
            // const board = this.board;
            // const groupIdx = board.groups.findIndex(group => group.cards.some(card => card.id === this.card.id));
            // if (groupIdx === -1) return;
            // board.groups[groupIdx].cards.push(cardCopy);
            // this.updateBoard(board);
        },
        async deleteCard() {
            const userAnc = await Swal.fire({
                position: 'center',
                title: 'Are you sure you want to delete this card?',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonColor: '#ff505b',
                cancelButtonColor: 'transparent',
                confirmButtonText: 'Delete'
            });
            if (!userAnc.isConfirmed) return;
            const board = this.board;
            let cardTitle;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === this.card.id);
                if (cardIdx !== -1) {
                    cardTitle = group.cards[cardIdx].title;
                    group.cards.splice(cardIdx, 1);
                }
            })
            this.updateBoard(board);
            this.emitClose();
            const loggedinUser = this.$store.getters.loggedinUser;
            socketService.emit('change-board', { msg: `${loggedinUser.username} deleted card '${cardTitle}'`, boardId: board._id, members: this.members(loggedinUser) });
            this.myAlert('Card was successfully deleted');
            this.addActivity(`deleted the card '${cardTitle}'`);
        },
        moveCard(status) {
            this.$store.commit({ type: 'updateCardStatus', status });
            const board = this.board;
            this.updateBoard(board);
            this.isPopUp = false;
            if (status.startGroup !== status.endGroup) {
                const groupTitle = board.groups.find(group => group.id === status.endGroup).title;
                const loggedinUser = this.$store.getters.loggedinUser;
                const msg = status.isClone ? `${loggedinUser.username} cloned card '${this.card.title}' to list '${groupTitle}'` : `${loggedinUser.username} moved card '${this.card.title}' to list '${groupTitle}'`;
                const alertMsg = status.isClone ? 'Card was successfully cloned' : 'Card was successfully moved';
                socketService.emit('change-board', { msg, boardId: board._id, members: this.members(loggedinUser) });
                this.myAlert(alertMsg);
                this.addActivity(`moved card '${this.card.title}' to '${groupTitle}'`, this.card);
            }
        },
        startUpload() {
            this.$refs['upload'].click();
        },
        updateAttachments(attachments) {
            const card = utilService.deepCopy(this.card)
            card.attachments = attachments;
            this.updateCard(card);
        },
        async onUpload(ev) {
            this.isLoading = true;
            const res = await uploadImg(ev);
            const imgRatio = res.width / res.height;
            const imgClass = {
                regular: imgRatio > 0.9 && imgRatio < 1.1,
                portrait: imgRatio <= 0.9,
                landscape: imgRatio >= 1.1
            };
            const attachment = {
                id: utilService.makeId(),
                name: res.original_filename,
                format: res.format,
                src: res.url,
                imgClass
            }
            if (!this.card.attachments) this.card.attachments = []
            const updatedCard = utilService.deepCopy(this.card)
            updatedCard.attachments.push(attachment)
            this.isLoading = false;
            this.updateCard(updatedCard)
            this.card = updatedCard;
        },
        updateDesc(newDesc) {
            let card = this.card;
            card.description = newDesc;
            this.updateCard(card);
        },
        emitMove() {
            this.currPopUp = 'move';
            this.isPopUp = true;
        },
        setDate() {
            this.currPopUp = 'duedate';
            this.$nextTick(() => {
                document.querySelector('.el-date-editor .el-input__inner').focus();
            })
        },
        removeDate() {
            const card = utilService.deepCopy(this.card)
            card.dueDate = null;
            this.updateCard(card);
            this.card = card;
            const loggedinUser = this.$store.getters.loggedinUser;
            socketService.emit('change-board', { msg: `${loggedinUser.username} removed the due date from card '${card.title}'`, members: this.members(loggedinUser) });
            this.myAlert('Due date was successfully removed');
            this.addActivity(`removed the due date from `, card);
        },
        setNewDate(dueDate) {
            const updatedCard = utilService.deepCopy(this.card)
            let txt;
            if (this.card.dueDate) {
                delete this.card.dueDate;
                txt = 'changed'
            } else {
                txt = 'added'
                this.card.isDone = false;
            }
            updatedCard.dueDate = dueDate
            this.updateCard(updatedCard);
            this.card = updatedCard;
            this.closePopup();
            const loggedinUser = this.$store.getters.loggedinUser;
            const msg = txt === 'changed' ? `${loggedinUser.username} changed the due date to card '${updatedCard.title}'` : `${loggedinUser.username} added a due date to card '${updatedCard.title}'`;
            const alertMsg = txt === 'changed' ? 'Due date was successfully changed' : 'Due date was successfully added';
            socketService.emit('change-board', { msg, members: this.members(loggedinUser) });
            this.myAlert(alertMsg);
            this.addActivity(`${txt} due date to `, updatedCard);
        },
        openLabels() {
            this.currPopUp = 'labels';
            this.isPopUp = true;
        },
        updateLabelTitle(labelId, title) {
            const board = this.board;
            const idx = board.labels.findIndex(label => label.id === labelId);
            if (idx !== -1) board.labels[idx].title = title;
            this.updateBoard(board);
        },
        addChecklist() {
            this.currPopUp = 'checklist';
            this.isPopUp = true;
        },
        openCoverPicker() {
            this.currPopUp = 'cover';
            this.isPopUp = true;
        },
        updateCover(color, isFull) {
            const card = utilService.deepCopy(this.card)
            card.style.headerColor = color;
            card.style.isFull = isFull;
            this.updateCard(card);
        },
        onAddMembers() {
            this.currPopUp = 'member';
            this.isPopUp = true;
        },
        updateMembers(userId) {
            const card = this.card;
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
            const msg = memberIdx === -1 ? `${newUser.username} was added to '${card.title}' card` : `${newUser.username} was removed from '${card.title}' card`;
            const alertMsg = memberIdx === -1 ? `${newUser.username} was successfully added` : `${newUser.username} was successfully removed`;
            socketService.emit('change-board', { msg, members: this.members(loggedinUser) });
            this.myAlert(alertMsg);
            const action = (memberIdx === -1) ? `added ${newUser.username} to ` : `removed ${newUser.username} from`;
            this.addActivity(action, card, null, this.loggedinUser)
        },
        cardMembers() {
            if (!this.card.members) {
                this.card.members = [];
            }
            return this.card.members;
        },
        updeteChecklist(checklist) {
            const card = this.card;
            const idx = card.checklistGroup.findIndex(currChecklist => currChecklist.id === checklist.id);
            if (idx !== -1) card.checklistGroup.splice(idx, 1, checklist);
            this.updateCard(card);
        },
        deleteChecklist(checklistId) {
            const card = this.card;
            const idx = card.checklistGroup.findIndex(currChecklist => currChecklist.id === checklistId);
            if (idx !== -1) card.checklistGroup.splice(idx, 1);
            this.updateCard(card);
        },
        toggleIsComplete() {
            const card = this.card;
            card.isDone = !card.isDone;
            this.updateCard(card);
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
        }
    },
    created() {
        const cardId = this.$route.params.cardId
        this.$store.commit({ type: 'setCurrCard', cardId })
        this.card = this.$store.getters.currCard;
        this.$store.dispatch('loadUsers')
        socketService.on('card-update', this.updateCardSocket)
        socketService.emit('set-card', cardId);
    },
    destroyed() {
        socketService.off('card-update', this.updateCardSocket)
        this.$store.commit({ type: 'updateCurrCard', card: null })
        this.card = null;
    },
    components: {
        cardActivity,
        cardMove,
        datePicker,
        addMembers,
        cardAttachments,
        cardCover,
        cardLabels,
        customAvatar,
        popUp,
        // checkBox,
        addChecklist,
        cardChecklist,
        cardDescription
    }
}
</script>
