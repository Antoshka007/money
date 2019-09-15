<template>
    <v-form
            v-model="isValid"
            ref="form"
            @submit.prevent="formSubmitHandler"
    >
        <v-container>
            <v-row align="center">
                <v-col cols="12" md="6">
                    <v-text-field
                            v-model="name"
                            ref="name"
                            :label="nameLabel"
                            required
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field
                            v-model="value"
                            :rules="valueRules"
                            :label="valueLabel"
                            required
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-select
                            v-model="category"
                            :items="categories"
                            label="Категория"
                            clearable
                    ></v-select>
                </v-col>

                <v-col cols="12" md="6" class="text-right">
                    <v-btn text type="submit" class="blue--text" block>
                        <v-icon left>mdi-plus</v-icon>
                        Добавить
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
	export default {
		props: ['onSubmit', 'nameLabel', 'valueLabel', 'categories'],
		data() {
			return {
				isValid: false,
				name: '',
				value: '',
				category: '',
				valueRules: [v => !v || parseInt(v, 10) > 0 || 'Введите положительное число'],
			};
		},
		methods: {
			formSubmitHandler() {
				const name = this.name.trim();
				const value = parseInt(this.value, 10);

				if (this.isValid && value && name) {
					this.onSubmit({
						name: name,
						value: value,
						category: this.category
					});

					this.$refs.name.focus();
					this.$refs.form.reset();
				}
			},
		}
	};
</script>