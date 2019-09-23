<template>
    <p class="headline text-center blue-grey--text text--darken-2 mt-10">
        Текущий месяц:
        <span :class="{
                'grey--text': !sum,
                'green--text': sum > 0,
                'red--text': sum < 0
            }"
        >
            <span v-show="sum > 0">+</span>{{sum}} руб.
        </span>
    </p>
</template>

<script>
    export default {
        props: { sum: Number }
    };
</script>