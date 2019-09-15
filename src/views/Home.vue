<template>
    <div>
        <v-row v-if="!isLoggedIn">
            <v-col cols="12">
                <h1 class="text-center display-1 mb-10">Добро пожаловать в MyMoney</h1>

                <p class="custom-description">
                    Данный сервис поможет Вам в управлении личными финансами. Записывайте свои доходы
                    и расходы, распределяя их по категориям, а MyMoney наглядным образом визуализирует все данные,
                    чтобы вы хорошо понимали своё финансовое положение.
                </p>
            </v-col>
        </v-row>

        <v-row v-if="isLoggedIn">
            <v-col cols="12">
                <p class="headline text-center grey--text">
                    Текущий месяц:
                    <span
                            :class="{
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
                <h2 class="title text-center grey--text">Доходы</h2>

                <Form
                        :onSubmit="onSubmitIncome"
                        nameLabel="Я получил"
                        valueLabel="В размере"
                        :categories="incomeCategories"
                />

                <p class="grey--text custom-month-panel">
                    За текущий месяц вы заработали:
                    <span class="green--text ml-1">+{{incomeSum}} руб.</span>

                    <v-btn
                            class="custom-month-panel__btn"
                            text
                            icon
                            v-show="!isIncomeChartShown"
                            @click="isIncomeChartShown = true"
                    >
                        <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>

                    <v-btn
                            class="custom-month-panel__btn"
                            text
                            icon
                            v-show="isIncomeChartShown"
                            @click="isIncomeChartShown = false"
                    >
                        <v-icon>mdi-chevron-up</v-icon>
                    </v-btn>
                </p>

                <div class="mb-4 custom-chart" v-if="isIncomeChartShown">
                    <Pie :chartData="incomeChartData"/>
                </div>

                <Item
                        v-for="item in income"
                        :key="item.id"
                        valuePrefix="+"
                        valueColor="green"
                        :item="item"
                        :onRemove="onRemoveIncome"
                />
            </v-col>

            <v-col cols="6">
                <h2 class="title text-center grey--text">Расходы</h2>

                <Form
                        :onSubmit="onSubmitOutcome"
                        nameLabel="Я приобрёл"
                        valueLabel="Потратил"
                        :categories="outcomeCategories"
                />

                <p class="grey--text custom-month-panel">
                    За текущий месяц вы потратили:
                    <span class="red--text ml-1">-{{outcomeSum}} руб.</span>

                    <v-btn
                            class="custom-month-panel__btn"
                            text
                            icon
                            v-show="!isOutcomeChartShown"
                            @click="isOutcomeChartShown = true"
                    >
                        <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>

                    <v-btn
                            class="custom-month-panel__btn"
                            text
                            icon
                            v-show="isOutcomeChartShown"
                            @click="isOutcomeChartShown = false"
                    >
                        <v-icon>mdi-chevron-up</v-icon>
                    </v-btn>
                </p>

                <div class="mb-4 custom-chart" v-if="isOutcomeChartShown">
                    <Pie :chartData="outcomeChartData"/>
                </div>

                <Item
                        v-for="item in outcome"
                        :key="item.id"
                        valuePrefix="-"
                        valueColor="red"
                        :item="item"
                        :onRemove="onRemoveOutcome"
                />
            </v-col>
        </v-row>
    </div>
</template>

<script>
	import firebase from 'firebase/app';
	import 'firebase/auth';
	import 'firebase/firestore';
	import Form from '@/components/Form';
	import Item from '@/components/Item';
	import Pie from '@/components/Pie';

	const db = firebase.firestore();

	export default {
		components: { Pie, Form, Item },
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
					const categoryData = data.find(v => v.category === item.category);

					if (categoryData) {
						categoryData.sum += item.value;
					} else {
						data.push({
							category: item.category,
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
				this.userID = user.uid;
				this.isLoggedIn = !!user;

				if (this.userID) {
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
                }
			});
        }
	};
</script>

<style>
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
</style>
