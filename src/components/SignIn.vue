<template>
    <v-form v-model="isValid" @submit.prevent="formSubmitHandler">
        <v-container>
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
							this.onSignIn();
						}, err => {
							this.isLoading = false;
							console.error(err.message);
						});
				}
            }
        }
	};
</script>