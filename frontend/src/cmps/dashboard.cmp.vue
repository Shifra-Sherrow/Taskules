<template>
    <section class="dashboard" >
        dashBoard
        <chart :usernames="usernames" :cardsCount="cardsCount"/>
    </section>
</template>

<script>
    import chart from '../cmps/custom-elements/chart.cmp.vue'
    export default {
        props: {
            board: Object,
            colors: Array,
        },
        data() {
            return{
                cardsCount: null,
                usernames: null,
                chartColors: null,
            }
        },
        methods: {
            usersCards(){
                const cardsByUserMap = {};
                this.board.groups.forEach( group => {
                    group.cards.forEach( card => {
                        if (!card.members) card.members = [];
                        card.members.forEach( (member,idx) => {
                            if (!cardsByUserMap[member._id]) {
                                cardsByUserMap[member._id] = {};
                                cardsByUserMap[member._id].cardsCount = 1;
                                cardsByUserMap[member._id].username = member.username;
                                cardsByUserMap[member._id].color = colors[idx];
                            } else cardsByUserMap[member._id].cardsCount++
                        })
                    })
                })
                const usernames = [];
                const cardsCount = [];
                for (const userId in cardsByUserMap) {
                    cardsCount.push(cardsByUserMap[userId].cardsCount + '');
                    usernames.push(cardsByUserMap[userId].username);
                }
                this.usernames = usernames;
                this.cardsCount = cardsCount;
            }
        },
        created(){
            this.usersCards();
        },
        components: {
            chart
        }
    }
</script>

<style>
</style>