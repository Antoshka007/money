<template>
    <v-hover v-slot:default="{ hover }">
        <v-card
                :elevation="hover ? 3 : 0"
                flat
                outlined
                class="mb-1"
        >
            <v-container class="pa-3">
                <v-row no-gutters>
                    <v-col cols="6">
                        <div class="caption grey--text">{{item.category || 'Без категории'}}</div>
                        <div>{{item.name}}</div>
                    </v-col>

                    <v-col
                            cols="6"
                            class="text-right"
                            :class="hover ? 'd-flex justify-end align-center' : ''"
                    >
                        <div v-show="!hover">
                            <div class="caption grey--text">{{formatDate(item.date)}}</div>
                            <div :class="`${valueColor}--text`">
                                {{valuePrefix}}{{item.value}} руб.
                            </div>
                        </div>

                        <div v-show="hover">
                            <v-btn icon color="red" depressed @click="removeClickHandler">
                                <v-icon>mdi-minus</v-icon>
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-hover>
</template>

<script>
	export default {
		props: ['valuePrefix', 'valueColor', 'item', 'onRemove'],
        methods: {
			removeClickHandler() {
                this.onRemove(this.item.id);
            },
            formatDate(date) {
				const [year, month, day] = date.split('-');
				return [day, month, year].join('.');
            }
        }
	};
</script>