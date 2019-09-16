<template>
    <nav>
        <v-app-bar flat app class="yellow lighten-1">
            <v-toolbar-title class="blue-grey--text text--darken-2">
                MyMoney
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-dialog v-if="!isLoggedIn" v-model="isDialogOpen" width="300">
                <template v-slot:activator="{ on }">
                    <v-btn text v-on="on" class="blue-grey--text text--darken-2">
                        Войти
                        <v-icon right>mdi-exit-to-app</v-icon>
                    </v-btn>
                </template>

                <v-tabs grow>
                    <v-tab class="custom-tab" href="#tab-login">
                        Вход
                    </v-tab>

                    <v-tab class="custom-tab" href="#tab-reg">
                        Регистрация
                    </v-tab>

                    <v-tab-item value="tab-login">
                        <v-form v-model="isLoginValid" @submit.prevent="loginSubmitHandler">
                            <v-container>
                                <v-text-field
                                        v-model="loginEmail"
                                        label="Email"
                                        :rules="inputRules"
                                ></v-text-field>

                                <v-text-field
                                        type="password"
                                        v-model="loginPassword"
                                        label="Пароль"
                                        :rules="inputRules"
                                ></v-text-field>

                                <div class="text-right">
                                    <v-btn text class="blue--text" type="submit" :loading="isLoginLoading">
                                        Войти
                                    </v-btn>
                                </div>
                            </v-container>
                        </v-form>
                    </v-tab-item>

                    <v-tab-item value="tab-reg">
                        <v-form v-model="isRegValid" @submit.prevent="regSubmitHandler">
                            <v-container>
                                <v-text-field
                                        v-model="regEmail"
                                        label="Email"
                                        :rules="inputRules"
                                ></v-text-field>

                                <v-text-field
                                        type="password"
                                        v-model="regPassword"
                                        label="Пароль"
                                        :rules="inputRules"
                                ></v-text-field>

                                <div class="text-right">
                                    <v-btn text class="blue--text" type="submit" :loading="isRegLoading">
                                        Отправить
                                    </v-btn>
                                </div>
                            </v-container>
                        </v-form>
                    </v-tab-item>
                </v-tabs>
            </v-dialog>

            <div v-if="isLoggedIn" class="blue-grey--text text--darken-2">
                {{this.userEmail}}

                <v-btn text @click="logoutClickHandler" class="blue-grey--text text--darken-2">
                    Выйти
                    <v-icon right>mdi-logout-variant</v-icon>
                </v-btn>
            </div>
        </v-app-bar>
    </nav>
</template>

<script>
    import firebase from 'firebase/app';
	import 'firebase/auth';

    export default {
        data() {
        	return {
        		isLoggedIn: false,
                userEmail: null,
        	    isDialogOpen: false,
                isLoginValid: false,
                loginEmail: '',
                loginPassword: '',
                isLoginLoading: false,
                isRegValid: false,
                regEmail: '',
                regPassword: '',
                isRegLoading: false,
                inputRules: [
                    v => !!v || 'Обязательно'
                ],
            };
        },
        methods: {
        	loginSubmitHandler() {
                if (this.isLoginValid) {
                	this.isLoginLoading = true;

					firebase.auth().signInWithEmailAndPassword(this.loginEmail, this.loginPassword)
						.then(user => {
							this.isLoginLoading = false;
							this.isDialogOpen = false;
							console.log('Пользователь авторизован!');
						}, err => {
							this.isLoginLoading = false;
							console.error(err.message);
						});
                }
            },
            regSubmitHandler() {
				if (this.isRegValid) {
					this.isRegLoading = true;

					firebase.auth().createUserWithEmailAndPassword(this.regEmail, this.regPassword)
                        .then(user => {
                        	this.isRegLoading = false;
                        	this.isDialogOpen = false;
						    console.log('Регистрация прошла успешно');
                        }, err => {
							this.isRegLoading = false;
                        	console.error(err.message);
                        });
				}
            },
            logoutClickHandler() {
        		firebase.auth().signOut().then(() => {
        			console.log('Выход выполнен успешно');
                });
            }
        },
        created() {
			firebase.auth().onAuthStateChanged((user) => {
				this.isLoggedIn = !!user;

				if (user) {
					this.userEmail = user.email;
                } else {
					this.userEmail = null;
                }
			});
        }
    };
</script>

<style>
    .custom-tab {
        width: 50% !important;
        margin: 0 !important;
    }
</style>