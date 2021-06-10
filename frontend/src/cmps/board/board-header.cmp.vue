<template>
    <section v-if="board" class="board-header" ref="board-header">
        <div class="header-container flex">
            <input
                v-autowidth="{
                    maxWidth: '960px',
                    minWidth: '20px',
                    comfortZone: 30,
                }"
                class="title"
                type="text"
                maxlength="20"
                @keyup.enter="emitTitleChange"
                @blur="emitTitleChange"
                v-model="boardTitle"
                ref="myInput"
            />
            <button
                class="favorite flex f-center"
                v-if="isFavorite"
                @click="toggleMarkBoard"
            >
                <i class="fas fa-star"></i>
            </button>
            <button
                class="favorite flex f-center"
                v-else
                @click="toggleMarkBoard"
            >
                <i class="far fa-star"></i>
            </button>
            <span class="seperator"></span>
            <span class="private-icon">
                <i v-if="board.isPrivate" class="fas fa-lock"></i>
                <i v-else class="fas fa-lock-open"></i>
            </span>
            <el-select
                v-model="privacy"
                class="privacy"
                popper-class="dropdown"
                @change="emitPrivacyChange"
            >
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <span class="seperator"></span>
            <div class="board-members flex">
                <custom-avatar
                    class="member member-card"
                    :size="40"
                    :username="board.byMember.username"
                    :src="board.byMember.imgUrl"
                    @click.native="emitFilter(board.byMember._id)"
                    :class="checkClass(board.byMember._id)"
                />
                <div
                    class="member"
                    v-for="member in boardMembers"
                    :key="member._id"
                >
                    <custom-avatar
                        v-if="member._id !== board.byMember._id"
                        class="member-card"
                        :size="40"
                        :username="member.username"
                        :src="member.imgUrl"
                        @click.native="emitFilter(member._id)"
                        :class="checkClass(member._id)"
                    />
                </div>

                <span class="add-btn add-btn" @click.stop="addUsers">
                    Invite
                </span>
                <add-users
                    @click.stop
                    v-if="isAddUsers"
                    :allUsers="usersToAdd"
                    :boardUsers="this.board.members"
                    @closeUsers="closeUsers"
                    @updateUsers="updateUsers"
                />
            </div>
        </div>
        <button class="menu-btn desktop" @click="emitOpenMenu">
            Show Menu <span data-txt=""></span>
        </button>
        <button class="menu-btn mobile" @click="emitOpenMenu">
            Menu <span data-txt=""></span>
        </button>
    </section>
</template>

<script>
import addUsers from './add-users.cmp';
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'
import { utilService } from '../../services/util.service';


export default {
    props: {
        board: Object,
        users: Array,
        user: Object
    },
    data() {
        return {
            boardTitle: null,
            isAddUsers: false,
            options: (this.user._id !== 'guest') ? [
                { value: 'private', label: 'Private' },
                { value: 'public', label: 'Public' }
            ] : [
                    { value: 'public', label: 'Public' }
                ],
            privacy: null,
            filterBy: {
                txt: "",
                membersIds: [],
                labelsIds: []
            }
        }
    },
    methods: {
        toggleMarkBoard() {
            this.$emit('markBoard');
        },
        emitOpenMenu() {
            this.$emit('openMenu')
        },
        addUsers() {
            this.isAddUsers = true;
        },
        closeUsers() {
            this.isAddUsers = false
        },
        updateUsers(userId) {
            this.$emit('updateboardUsers', userId)
        },
        emitTitleChange() {
            this.$emit('updateTitle', this.boardTitle);
            setTimeout(() => {
                this.$refs.myInput.blur();
            }, 0);
        },
        closeMenu() {
            this.isMenu = false;
        },
        emitPrivacyChange() {
            this.$emit('privacyChange', this.privacy)
        },
        emitFilter(memberId) {
            if (this.filterBy['membersIds'].includes(memberId)) {
                const idIdx = this.filterBy['membersIds'].findIndex(currId => currId === memberId)
                if (idIdx !== -1) this.filterBy['membersIds'].splice(idIdx, 1)
            } else this.filterBy['membersIds'].push(memberId)

            this.$emit('filter', utilService.deepCopy(this.filterBy))
        },
        isChecked(memberId) {
            return this.filterBy.membersIds.some(id => id === memberId)
        },
        closeAddUsers(ev) {
            if (ev.target.dataset.name === 'member') return
            this.isAddUsers = false;
        }
    },
    computed: {
        isFavorite() {
            return this.board.isMarked;
        },
        usersToAdd() {
            return this.users.filter(user => user._id !== this.board.byMember._id)
        },
        boardMembers() {
            return this.board.members;
        },
        isPrivate() {
            return this.board.isPrivate ? 'Private' : 'Public'
        },
        checkClass() {
            return (memberId) => ({ 'checked': this.isChecked(memberId) })
        }
    },
    created() {
        this.boardTitle = this.board.title;
        this.privacy = (this.isPrivate);
        document.addEventListener('click', this.closeAddUsers)
    },
    destroyed() {
        document.removeEventListener('click', this.closeAddUsers)
    },
    components: {
        customAvatar,
        addUsers,
    }
}
</script>

<style>
</style>