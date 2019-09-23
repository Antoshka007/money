<template>
    <p class="blue-grey--text text--lighten-1 custom-month-panel">
        {{isIncome ? 'За текущий месяц вы заработали:' : 'За текущий месяц вы потратили:'}}

        <span class="ml-1" :class="sumClass">
            {{ sumPrefix }}{{sum}} руб.
        </span>

        <v-btn class="custom-month-panel__btn" text icon
               v-show="!isChartShown && sum > 0"
               @click="onToggle"
        >
            <v-icon>mdi-chevron-down</v-icon>
        </v-btn>

        <v-btn class="custom-month-panel__btn" text icon
               v-show="isChartShown && sum > 0"
               @click="onToggle"
        >
            <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
    </p>
</template>

<script>
    export default {
        props: {
        	isIncome: Boolean,
            sum: Number,
            isChartShown: Boolean,
            onToggle: Function,
        },
        computed: {
        	sumPrefix() {
        		if (!this.sum) return '';

        		return this.isIncome ? '+' : '-';
            },
            sumClass() {
        		if (!this.sum) return '';

        		return this.isIncome ? 'green--text' : 'red--text';
            }
        }
    };
</script>

<style>
    .custom-month-panel {
        display: flex;
    }

    .custom-month-panel__btn {
        margin-left: auto;
        margin-top: -6px;
    }
</style>