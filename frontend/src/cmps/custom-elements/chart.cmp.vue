<script>
import { Doughnut } from 'vue-chartjs'

export default {
    props: {
        cardsCount: Array,
        usernames: Array
    },
    extends: Doughnut,
    mounted() {
        // Overwriting base render method with actual data.
        this.renderChart({
            labels: this.usernames,
            datasets: [
                {
                    label: 'User Cards',
                      backgroundColor: [
                        '#ff6384',
                        '#36a2eb',
                        '#cc65fe'
                    ],
                    data: this.cardsCount,
                }
            ]
        })
    }
}


</script>
