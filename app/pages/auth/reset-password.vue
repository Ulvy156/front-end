<template>
    <!-- PAGE BACKGROUND -->
    <section class="min-h-dvh flex items-center justify-center px-4
           bg-linear-to-br from-slate-200 via-slate-100 to-slate-200">
        <!-- GLASS CARD -->
        <form class="w-full max-w-md
             bg-white/70 backdrop-blur-xl
             border border-white/60
             shadow-[0_25px_50px_-15px_rgba(0,0,0,0.25)]
             rounded-2xl p-6
             flex flex-col items-center gap-y-6">
            <!-- Header -->
            <div class="text-center space-y-1">
                <h3 class="text-xl font-semibold text-slate-900">
                    {{ $t('auth.forgotPass') }}
                </h3>
                <p class="text-slate-500 text-sm">
                    {{ $t('auth.forgotPassDesc') }}
                </p>
            </div>

            <!-- Email -->
            <div class="w-full my-5">
                <label for="mail" class="text-sm font-medium text-slate-700">
                    {{ $t('auth.email') }}
                </label>
                <BaseInput id="mail" size="large" :placeholder="$t('auth.emailPlaceholder')" v-model="email">
                    <template #prefix>
                        <BaseIcon name="mail" />
                    </template>
                </BaseInput>
            </div>

            <!-- Submit -->
            <button type="submit" class="w-full rounded-xl bg-blue-500 py-3
               font-semibold text-white
               hover:bg-blue-600 transition">
                {{ $t('auth.reset_password') }}
            </button>

            <!-- back to login -->
            <NuxtLink to="/auth/login" class="text-sm  font-semibold flex items-end gap-x-3">
                <BaseIcon name="move-left" />
                {{ $t("auth.back_login") }}
            </NuxtLink>
        </form>
    </section>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'


const email = ref('')
const password = ref('')

const submit = () => {
    console.log({ email: email.value, password: password.value })
}
</script>
