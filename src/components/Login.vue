<template>
    <v-form v-model="isValid" @submit.prevent="formSubmitHandler">
        <v-container>
            <p v-show="isError" class="text-center red--text">
                {{errorText}}
            </p>

            <v-text-field
                    type="email"
                    v-model="email"
                    label="Email"
                    :rules="inputRules"
            ></v-text-field>

            <v-text-field
                    type="password"
                    v-model="password"
                    label="Пароль"
                    :rules="inputRules"
            ></v-text-field>

            <div class="text-right">
                <v-btn text class="blue--text" type="submit" :loading="isLoading">
                    Войти
                </v-btn>
            </div>
        </v-container>
    </v-form>
</template>

<script>
	import firebase from 'firebase/app';
	import 'firebase/auth';

    export default {
    	props: { onLogin: Function },
        data() {
            return {
                isValid: false,
                isLoading: false,
                isError: false,
                errorText: '',
                email: '',
                password: '',
				inputRules: [
					v => !!v || 'Обязательно'
				],
            };
        },
        methods: {
        	formSubmitHandler() {
				if (this.isValid) {
					this.isLoading = true;

					firebase.auth().signInWithEmailAndPassword(this.email, this.password)
						.then(() => {
							this.isLoading = false;
							this.isError = false;
							this.onLogin();
						}, err => {
							const errors = {
                                'auth/invalid-email': 'Неверный email.',
                                'auth/user-disabled': 'Пользователь с таким email заблокирован.',
                                'auth/user-not-found': 'Пользователь с таким email не зарегистрирован.',
                                'auth/wrong-password': 'Неверный пароль.',
                            };

							this.isLoading = false;
							this.errorText = errors[err.code] || 'Что-то пошло не так.';
							this.isError = true;
						});
				}
            }
        }
    };
</script>