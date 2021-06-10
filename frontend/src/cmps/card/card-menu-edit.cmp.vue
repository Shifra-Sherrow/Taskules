<template>
    <section v-if="card" class="card-menu-edit flex" :style="menuPos" :class="menuClass">
        <div class="flex f-col">
            <div
                class="title-edit mini-preview icons flex wrap"
                :style="inputWidth"
            >
                <ul
                    v-if="card.labels && labelsSelected.length"
                    class="label-marks flex wrap"
                >
                    <li
                        class="flex"
                        v-for="label in labelsSelected"
                        :key="label"
                    >
                        <div
                            class="label"
                            :style="{ backgroundColor: label }"
                        ></div>
                    </li>
                </ul>
                <textarea
                    @keydown.enter.prevent
                    @keyup.enter="saveTitle"
                    ref="card-title"
                    class="title-edit-menu-bar"
                    placeholder="Enter a title for this card…"
                    maxlength="120"
                    v-model="cardTxt"
                ></textarea>
                <div class="icons flex wrap">
                    <span class="small-icons flex f-center">
                        <i
                            v-if="card.dueDate"
                            :style="dueDateStyle"
                            class="far fa-clock"
                        >
                            <span>
                                {{
                                    moment(card.dueDate).format("MMM Do")
                                }}</span
                            >
                        </i>

                        <i v-if="card.description" class="description-icon"
                            ><img src="@/assets/svg/desc.svg"
                        /></i>
                        <i
                            v-if="card.checklistGroup && checklist"
                            class="checklist-icon flex f-center"
                            :class="isChecklistDone"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="12"
                                viewBox="0 0 48 43"
                            >
                                <g>
                                    <g class="gcheck">
                                        <path
                                            fill="#42526e"
                                            d="M.211 39.598c.002 1.875.964 2.867 2.782 2.87 12.197.02 24.38.02 36.211-.002 1.69-.003 2.705-.997 2.718-2.66.036-4.56.028-9.197.02-13.684l-.006-3.174c0-.98-.407-1.621-1.24-1.96-.63-.256-1.254-.214-1.756.122-.586.389-.926 1.12-.934 2.004-.026 3.15-.023 6.3-.019 9.452l.003 3.813V38.442H4.235V4.705h6.872c7.986 0 15.972.002 23.958 0h.23c.424.007.833.006 1.22-.065 1.045-.19 1.736-1.071 1.643-2.094-.097-1.057-.984-1.776-2.114-1.778L33.226.79c-3.884.036-7.768.056-11.65.065C18.11.85 14.645.826 11.18.799 8.676.78 6.172.762 3.668.75H3.61c-1.354 0-2.182.222-2.68.716-.494.49-.716 1.296-.718 2.612a10782.9 10782.9 0 0 0 0 35.519z"
                                        />
                                    </g>
                                    <g class="gcheck">
                                        <path
                                            fill="#42526e"
                                            d="M47.128 4.654c-.365-.386-.813-.594-1.295-.603-.62-.006-1.264.298-1.844.87a770.692 770.692 0 0 0-4.526 4.515L22.335 26.614l-2.65-2.665c-1.812-1.822-3.574-3.595-5.345-5.358-.583-.58-1.208-.887-1.807-.887l-.022.001c-.477.007-.927.217-1.3.608-.814.853-.696 2.052.3 3.055a1945.64 1945.64 0 0 0 9.085 9.086c1.25 1.237 2.215 1.245 3.442.018 7.597-7.58 15.185-15.17 22.767-22.764 1.017-1.019 1.14-2.19.323-3.055z"
                                        />
                                    </g>
                                </g></svg
                            ><span>{{ todoStatus }}</span></i
                        >
                        <i
                            v-if="card.attachments && card.attachments.length"
                            class="fas fa-paperclip"
                        ></i>
                        <i v-if="commentsLen" class="flex comments-icon">
                            <img src="@/assets/svg/txtbox.svg" />
                            {{ commentsLen }}</i
                        >
                    </span>
                    <span
                        class="members-container flex"
                        v-if="card.members && card.members.length"
                    >
                        <div
                            class="card-members"
                            v-for="member in card.members"
                            :key="member._id"
                        >
                            <custom-avatar
                                :size="30"
                                :username="member.username"
                                :src="member.imgUrl"
                            />
                        </div>
                    </span>
                </div>
            </div>
            <div class="add-card-btns flex">
                <button @click="saveTitle" class="edit-title-btn">Save</button>
            </div>
        </div>
        <div class="edit-card-actions flex f-col">
            <button class="action-btn" @click="editLabel" :class="btnsClass">
                <div class="flex">
                    <img
                        class="icon-btn"
                        src="@/assets/svg/label-white.svg"
                        alt=""
                    />
                    Edit Labels
                </div>
                <pop-up
                    class="edit-card"
                    v-if="board && isCmpOpen('labels')"
                    @closePopup="closePopup"
                    :style="popupPos"
                >
                    <card-labels
                        :card="card"
                        :boardLabels="board.labels"
                        @updateCard="updateCardLabel"
                        @updateLabelTitle="updateLabelTitle"
                        @setDimensions="setPopupDimensions"
                    />
                </pop-up>
            </button>
            <button
                class="action-btn"
                @click="changeMembers"
                :class="btnsClass"
            >
                <div class="flex">
                    <img
                        class="icon-btn"
                        src="@/assets/svg/member-white.svg"
                        alt=""
                    />
                    Change Members
                </div>
                <pop-up
                    class="edit-card"
                    v-if="isCmpOpen('member')"
                    @closePopup="closePopup"
                    :style="popupPos"
                    ><add-members
                        :cardMembers="cardMembers()"
                        :boardMembers="boardMembers"
                        @updateMembers="updateMembers"
                        @setDimensions="setPopupDimensions"
                    />
                </pop-up>
            </button>
            <button class="action-btn" @click="move" :class="btnsClass">
                <div class="flex">
                    <img
                        class="icon-btn"
                        src="@/assets/svg/move-white.svg"
                        alt=""
                    />
                    Move
                </div>
                <pop-up
                    class="edit-card"
                    v-if="isCmpOpen('move')"
                    @closePopup="closePopup"
                    :style="popupPos"
                >
                    <card-move
                        :isClone="false"
                        :groups="board.groups"
                        :group="currGroup"
                        :currPosition="currPosition"
                        @moveCard="moveCard"
                        @setDimensions="setPopupDimensions"
                /></pop-up>
            </button>
            <button class="action-btn" @click="copy" :class="btnsClass">
                <div class="flex">
                    <img
                        class="icon-btn"
                        src="@/assets/svg/copy-white.svg"
                        alt=""
                    />
                    Clone
                </div>
                <pop-up
                    class="edit-card"
                    v-if="isCmpOpen('clone')"
                    @closePopup="closePopup"
                    :style="popupPos"
                >
                    <card-move
                        :isClone="true"
                        :groups="board.groups"
                        :group="currGroup"
                        :currPosition="currPosition"
                        @moveCard="moveCard"
                /></pop-up>
            </button>
            <button
                class="action-btn due-date"
                @click="changeDueDate"
                :class="btnsClass"
            >
                <div class="flex">
                    <img
                        class="icon-btn"
                        src="@/assets/svg/clock-white.svg"
                        alt=""
                    />
                    Change Due Date
                </div>
                <date-picker
                    ref="date-picker"
                    class="date-picker"
                    slot="date-picker"
                    :dueDate="card.dueDate"
                    v-if="isPopUp"
                    @setDate="setNewDate"
                />
            </button>
        </div>
    </section>
</template>

<script>
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'
import popUp from '@/cmps/card/card-details/pop-up.cmp';
import addMembers from '@/cmps/custom-elements/add-members.cmp';
import datePicker from '@/cmps/custom-elements/date-picker.cmp';
import cardLabels from '@/cmps/card/card-details/card-labels.cmp';
import cardMove from '@/cmps/card/card-details/card-move.cmp';
import { utilService } from '@/services/util.service.js'
import { socketService } from '@/services/socket.service';
const Swal = require('sweetalert2');

export default {
    props: {
        currCard: Object,
        board: Object,
        clickPos: Object,
        loggedinUser: Object
    },
    data() {
        return {
            card: null,
            cardTxt: null,
            isPopUp: false,
            currPopUp: null,
            activities: this.board.activities,
            popupHeight: null,
            popupWidth: null,
            newClickPos: {},
            dimensions: {
                txtWidth: null,
                btnsWidth: null,
                height: null
            }
        }
    },
    computed: {
        isChecklistDone() {
            const isDone = this.card.checklistGroup.every(checklist => checklist.items.every(item => item.isDone))
            return isDone ? 'complete' : null;
        },
        checklist() {
            return this.card.checklistGroup.some(checklist => checklist.items.length > 0)
        },
        todoStatus() {
            const totalTodos = this.card.checklistGroup.reduce((counterList, checklist) => {
                let counterItem = checklist.items.reduce((counterItem, item) => {
                    counterItem.total++;
                    if (item.isDone) counterItem.done++;
                    return counterItem;
                }, { total: 0, done: 0 })
                counterList.total += counterItem.total;
                counterList.done += counterItem.done;
                return counterList;
            }, { total: 0, done: 0 })
            const txt = `${totalTodos.done}/${totalTodos.total}`;
            return txt;
        },
        commentsLen() {
            if (!this.activities.filter(activity => activity.comment && activity.card.id === this.card.id).length) return
            return ' ' + this.activities.filter(activity => activity.comment && activity.card.id === this.card.id).length;
        },
        dueDateStyle() {
            if (this.card.isDone) return { color: 'white', backgroundColor: '#5aac44' }
            if (this.card.dueDate < Date.now()) return { color: 'white', backgroundColor: '#ec9488' }
            else return {}
        },
        labelsSelected() {
            if (!this.card.labels) return [];
            const selectIds = this.card.labels.map(label => label.id);
            const selctLabels = this.board.labels.filter(label => selectIds.includes(label.id));
            return selctLabels.map(label => label.color);
        },
        dueDate() {
            return this.currPopUp === 'dueDate';
        },
        currGroup() {
            const group = this.board.groups.find(group => group.cards.some(card => card.id === this.card.id));
            return group;
        },
        currPosition() {
            return this.currGroup.cards.findIndex(card => card.id === this.card.id) + 1;
        },
        isCmpOpen() {
            return (cmpName) => this.isPopUp && this.currPopUp === cmpName;
        },
        boardMembers() {
            const membersToShow = utilService.deepCopy(this.board.members);
            membersToShow.push(utilService.deepCopy(this.board.byMember));
            return membersToShow
        },
        menuPos() {
            const { txtWidth, btnsWidth, height } = this.dimensions;
            const xClick = this.clickPos.x - this.clickPos.offsetX;
            const yClick = this.clickPos.y - this.clickPos.offsetY;
            const marginX = 16; // click offset from right of card
            const marginY = 15.5; // click offset from top of card

            const clickFromRight = this.clickPos.width - xClick;
            const clickFromBottom = this.clickPos.height - yClick;

            const scrollMargin = (this.clickPos.isScroll) ? 10 : 0;
            const isRtl = clickFromRight < btnsWidth + marginX;
            const btnsOffset = (isRtl) ? btnsWidth : 0;

            const left = xClick + marginX - txtWidth - btnsOffset + scrollMargin;
            const top = (clickFromBottom < height) ? 'unset' : yClick - marginY + 'px';
            const bottom = (clickFromBottom < height) ? '35px' : 'unset';
            return { 'left': left + 'px', 'top': top, 'bottom': bottom }
        },
        menuClass() {
            const clickFromRight = this.dimensions.btnsWidth + 16;
            return { 'rtl': (this.clickPos.width - this.clickPos.x + this.clickPos.offsetX < clickFromRight) }
        },
        btnsClass() {
            return { 'no-popup': !this.isPopUp }
        },
        popupPos() {
            const distFromBottom = this.newClickPos.height - this.newClickPos.y + this.newClickPos.offsetY;
            const distFromRight = this.newClickPos.width - this.newClickPos.x + this.newClickPos.offsetX;
            const padding = 30;
            const isRtl = (this.clickPos.width - this.clickPos.x + this.clickPos.offsetX < 181);
            const right = (isRtl) ? 0 : 'unset';
            const left = (isRtl) ? 'unset' : (distFromRight < this.popupWidth) ? distFromRight - this.popupWidth - padding + 'px' : 0;
            const top = (distFromBottom < this.popupHeight) ? 'unset' : '35px';
            const bottom = (distFromBottom < this.popupHeight) ? '35px' : 'unset';
            return { 'top': top, 'bottom': bottom, 'left': left, 'right': right }
        },
        inputWidth() {
            return { 'width': (this.clickPos.isScroll) ? '270px' : '280px' }
        }
    },

    methods: {
        // openPopup(cmp) {
        // 	this.isPoUp = true;
        // 	this.currPopUp = cmp;
        // 	if (cmp === 'dueDate') this.$nextTick(() => {
        // 		document.querySelector('.el-date-editor .el-input__inner').focus();
        // 	})
        // },
        changeDueDate() {
            this.$emit('isEditing', true)
            this.isPopUp = true;
            this.currPopUp = 'dueDate';
            this.$nextTick(() => {
                document.querySelector('.el-date-editor .el-input__inner').focus();
            })
        },
        closePopup() {
            this.isPopUp = false;
            this.currPopUp = '';
            setTimeout(() => this.$emit('isEditing', false), 10)
        },
        updateCardLabel(card) {
            this.$emit('updateCardLabel', card)
        },
        updateLabelTitle(labelId, title) {
            this.$emit('updateLabelTitle', labelId, title);
        },
        saveTitle() {
            this.$emit('updateCardTitle', this.cardTxt, this.card);
            this.closePopup();
        },
        editLabel(ev) {
            this.setClickPos(ev)
            this.isPopUp = true;
            this.$emit('isEditing', true)
            this.currPopUp = 'labels';
        },
        changeMembers(ev) {
            this.setClickPos(ev)
            this.isPopUp = true;
            this.$emit('isEditing', true)
            this.currPopUp = 'member';
        },
        move(ev) {
            this.setClickPos(ev)
            this.isPopUp = true;
            this.$emit('isEditing', true)
            this.currPopUp = 'move';
        },
        copy(ev) {
            this.setClickPos(ev)
            this.isPopUp = true;
            this.$emit('isEditing', true)
            this.currPopUp = 'clone';
        },
        moveCard(stat) {
            const status = stat;
            status.cardId = this.card.id
            this.$emit('moveCard', status, this.card);
            this.closePopup();
        },
        cardMembers() {
            if (!this.card.members) {
                this.card.members = [];
            }
            return this.card.members;
        },
        updateMembers(userId) {
            this.$emit('updateMembers', userId, this.card)
        },
        setNewDate(dueDate) {
            let txt;
            const updateCard = utilService.deepCopy(this.card)
            if (updateCard.dueDate) {
                delete updateCard.dueDate;
                txt = 'changed'
            } else {
                txt = 'added'
                updateCard.isDone = false;
            }
            updateCard.dueDate = dueDate;
            this.$emit('updateCard', updateCard);
            this.card = updateCard; 
            this.closePopup();
            const msg = txt === 'changed' ? `${this.loggedinUser.username} changed card '${this.card.title}' due date` : `${this.loggedinUser.username} added a due date to card '${this.card.title}'`;
            const alertMsg = txt === 'changed' ? 'Due date was successfully changed' : 'Due date was successfully added';
            socketService.emit('change-board', { msg, members: this.members(this.loggedinUser) });
            this.myAlert(alertMsg);
            this.$emit('updateActivities', `${txt} due date to `, updateCard)
        },
        setPopupDimensions({ popupWidth, popupHeight }) {
            this.popupHeight = popupHeight;
            this.popupWidth = popupWidth;
        },
        setClickPos({ x, y, offsetX, offsetY }) {
            if (this.isPopUp) return
            const pos = { x, y, width: window.innerWidth, height: window.innerHeight, offsetX, offsetY }
            this.newClickPos = pos;
        },
        setMenuDim() {
            const txtWidth = this.$el.children[0].offsetWidth;
            const btnsWidth = this.$el.children[1].offsetWidth;
            const height = this.$el.offsetHeight;
            this.dimensions = { txtWidth, btnsWidth, height };
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
    mounted() {
        this.setMenuDim()
        this.$nextTick(() => this.$refs['card-title'].focus());
    },
    created() {
        this.card = utilService.deepCopy(this.currCard);
        this.cardTxt = this.card.title;
        this.newClickPos = utilService.deepCopy(this.clickPos);
    },
    destroyed() {
        this.$emit('isEditing', false)
    },
    components: {
        popUp,
        addMembers,
        cardLabels,
        cardMove,
        datePicker,
        customAvatar
    }
}
</script>

<style>
</style>