<template>
    <div>
        <Welcome v-if="!isLoggedIn"/>

        <v-container v-if="isLoggedIn">
            <v-row>
                <v-col cols="12">
                    <p class="headline text-center blue-grey--text text--darken-2 mt-10">
                        Текущий месяц:
                        <span :class="{
                                'grey--text': incomeSum === outcomeSum,
                                'green--text': incomeSum > outcomeSum,
                                'red--text': outcomeSum > incomeSum
                            }"
                        >
                            <span v-show="incomeSum > outcomeSum">+</span>{{incomeSum - outcomeSum}} руб.
                        </span>
                    </p>
                </v-col>

                <v-col cols="6">
                    <h2 class="title text-center blue-grey--text text--darken-2">Доходы</h2>

                    <Form :onSubmit="onSubmitIncome" :categories="incomeCategories"
                          nameLabel="Название" valueLabel="Сумма"
                    />

                    <p class="blue-grey--text text--lighten-1 custom-month-panel">
                        За текущий месяц вы заработали:
                        <span class="ml-1"
                              :class="{'green--text': incomeSum > 0 }"
                        >
                            {{ incomeSum > 0 ? '+' : '' }}{{incomeSum}} руб.
                        </span>

                        <v-btn class="custom-month-panel__btn" text icon
                               v-show="!isIncomeChartShown && incomeSum > 0"
                               @click="isIncomeChartShown = true"
                        >
                            <v-icon>mdi-chevron-down</v-icon>
                        </v-btn>

                        <v-btn class="custom-month-panel__btn" text icon
                               v-show="isIncomeChartShown && incomeSum > 0"
                               @click="isIncomeChartShown = false"
                        >
                            <v-icon>mdi-chevron-up</v-icon>
                        </v-btn>
                    </p>

                    <div class="mb-4 custom-chart" v-if="isIncomeChartShown">
                        <Pie :chartData="incomeChartData"/>
                    </div>

                    <Item v-for="item in income" :key="item.id"
                          valuePrefix="+" valueColor="green"
                          :item="item" :onRemove="onRemoveIncome"
                    />
                </v-col>

                <v-col cols="6">
                    <h2 class="title text-center blue-grey--text text--darken-2">Расходы</h2>

                    <Form :onSubmit="onSubmitOutcome" :categories="outcomeCategories"
                          nameLabel="Название" valueLabel="Сумма"
                    />

                    <p class="blue-grey--text text--lighten-1 custom-month-panel">
                        За текущий месяц вы потратили:
                        <span class="ml-1"
                            :class="{ 'red--text': outcomeSum > 0 }"
                        >
                            {{outcomeSum > 0 ? '-' : ''}}{{outcomeSum}} руб.
                        </span>

                        <v-btn class="custom-month-panel__btn"
                               text icon
                               v-show="!isOutcomeChartShown && outcomeSum > 0"
                               @click="isOutcomeChartShown = true"
                        >
                            <v-icon>mdi-chevron-down</v-icon>
                        </v-btn>

                        <v-btn class="custom-month-panel__btn"
                               text icon
                               v-show="isOutcomeChartShown && outcomeSum > 0"
                               @click="isOutcomeChartShown = false"
                        >
                            <v-icon>mdi-chevron-up</v-icon>
                        </v-btn>
                    </p>

                    <div class="mb-4 custom-chart" v-if="isOutcomeChartShown">
                        <Pie :chartData="outcomeChartData"/>
                    </div>

                    <Item v-for="item in outcome" :key="item.id"
                          valuePrefix="-" valueColor="red"
                          :item="item" :onRemove="onRemoveOutcome"
                    />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
	import firebase from 'firebase/app';
	import 'firebase/auth';
	import 'firebase/firestore';
	import Form from '@/components/Form';
	import Item from '@/components/Item';
	import Pie from '@/components/Pie';
	import Welcome from '@/components/Welcome';

	const db = firebase.firestore();

	export default {
		components: { Pie, Form, Item, Welcome },
		data() {
			return {
				isLoggedIn: false,
                userID: null,
				incomeCategories: ['Активный доход', 'Пассивный доход', 'Подарок'],
				income: [],
				outcomeCategories: ['Продукты', 'Развлечения', 'Транспорт', 'Дом', 'Одежда'],
				outcome: [],
				isIncomeChartShown: false,
				isOutcomeChartShown: false,
			};
		},
		computed: {
			incomeSum() {
				return this.income.reduce((accumulator, income) => {
					return accumulator + income.value;
				}, 0);
			},
			outcomeSum() {
				return this.outcome.reduce((accumulator, outcome) => {
					return accumulator + outcome.value;
				}, 0);
			},
			incomeChartData() {
				return this.getChartData('income', this.income);
			},
			outcomeChartData() {
				return this.getChartData('outcome', this.outcome);
			},
		},
		methods: {
			onSubmitIncome(income) {
				db.collection(`users/${this.userID}/incomes`).add({
                    ...income,
					date: new Date().toISOString().substr(0, 10),
                }).then(() => {
					console.log('Доход успешно добавлен!');
				}).catch(() => {
					console.error('Не удалось добавить доход!');
                });
			},
			onSubmitOutcome(outcome) {
				db.collection(`users/${this.userID}/outcomes`).add({
					...outcome,
					date: new Date().toISOString().substr(0, 10),
				}).then(() => {
					console.log('Расход успешно добавлен!');
				}).catch(() => {
					console.error('Не удалось добавить расход!');
				});
			},
			onRemoveIncome(id) {
				db.collection(`users/${this.userID}/incomes`).doc(id).delete().then(() => {
					console.log('Доход успешно удалён!');
				}).catch(() => {
					console.error('Не удалось удалить доход!')
				});
			},
			onRemoveOutcome(id) {
				db.collection(`users/${this.userID}/outcomes`).doc(id).delete().then(() => {
					console.log('Расход успешно удалён!');
				}).catch(() => {
					console.error('Не удалось удалить расход!')
				});
			},
			getCategoryColor(type, category) {
				if (type === 'income') {
					switch (category) {
						case 'Активный доход':
							return '#4DD0E1';
						case 'Пассивный доход':
							return '#81C784';
						case 'Подарок':
							return '#FFB74D';
						default:
							return '#CCC';
					}
				} else {
					switch (category) {
						case 'Продукты':
							return '#81C784';
						case 'Развлечения':
							return '#F06292';
						case 'Транспорт':
							return '#A1887F';
						case 'Дом':
							return '#FFF176';
						case 'Одежда':
							return '#BA68C8';
						default:
							return '#CCC';
					}
				}
			},
			getChartData(type, items) {
				let data = [];

				items.forEach((item) => {
					const itemCategory = item.category || 'Другое';
					const categoryData = data.find(v => v.category === itemCategory);

					if (categoryData) {
						categoryData.sum += item.value;
					} else {
						data.push({
							category: itemCategory,
							color: this.getCategoryColor(type, item.category),
							sum: item.value
						});
					}
				});

				return {
					labels: data.map(v => v.category),
					datasets: [{
						backgroundColor: data.map(v => v.color),
						data: data.map(v => v.sum),
					}],
				};
			}
		},
        created() {
			firebase.auth().onAuthStateChanged((user) => {
				this.isLoggedIn = !!user;

				if (user) {
					this.userID = user.uid;

					db.collection(`users/${this.userID}/incomes`).onSnapshot((res) => {
						const changes = res.docChanges();

						changes.forEach(change => {
							if (change.type === 'added') {
								const income = {
									...change.doc.data(),
									id: change.doc.id,
								};

								if (change.newIndex) {
									this.income.push(income);
								} else {
									this.income.unshift(income);
								}
							} else if (change.type === 'removed') {
								let index = this.income.findIndex(income => {
									return (income.id === change.doc.id);
								});

								if (index !== -1) {
									this.income.splice(index, 1);
								}
							}
						});
					});

					db.collection(`users/${this.userID}/outcomes`).onSnapshot((res) => {
						const changes = res.docChanges();

						changes.forEach(change => {
							if (change.type === 'added') {
								const outcome = {
									...change.doc.data(),
									id: change.doc.id,
								};

								if (change.newIndex) {
									this.outcome.push(outcome);
								} else {
									this.outcome.unshift(outcome);
								}
							} else if (change.type === 'removed') {
								let index = this.outcome.findIndex(outcome => {
									return (outcome.id === change.doc.id);
								});

								if (index !== -1) {
									this.outcome.splice(index, 1);
								}
							}
						});
					});
                } else {
					this.income = [];
					this.outcome = [];
					this.userID = null;
                }
			});
        }
	};
</script>

<style>
    .custom-background {
        display: flex;
        align-items: flex-start;
        height: 100vh;
        margin-top: -56px;
        padding-top: 56px;

        background-image: url(../assets/background.jpg);
        background-size: cover;
        background-repeat: no-repeat;
    }

    .custom-background__inner {
        max-width: 700px;
        padding: 50px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 100px;

        background-color: rgba(255, 255, 255, 0.8);
    }

    .custom-description {
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .custom-chart {
        margin-left: auto;
        margin-right: auto;
        max-width: 300px;
    }

    .custom-month-panel {
        display: flex;
    }

    .custom-month-panel__btn {
        margin-left: auto;
        margin-top: -6px;
    }

    @media screen and (min-width: 960px) {
        .custom-background {
            margin-top: -64px;
            padding-top: 64px;
        }
    }
</style>
