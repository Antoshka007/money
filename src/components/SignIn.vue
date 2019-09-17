<template>
    <div>
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
                        Отправить
                    </v-btn>
                </div>
            </v-container>
        </v-form>
    </div>
</template>

<script>
	import firebase from 'firebase/app';
	import 'firebase/auth';

	export default {
		props: ['onSignIn'],
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

					firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
						.then(() => {
							this.isLoading = false;
							this.isError = false;
							this.onSignIn();
						}, err => {
							const errors = {
								'auth/email-already-in-use': 'Пользователь с таким email уже зарегистрирован.',
								'auth/invalid-email': 'Неверный email.',
								'auth/weak-password': 'Пароль должен содеражать как минимум 6 символов.',
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