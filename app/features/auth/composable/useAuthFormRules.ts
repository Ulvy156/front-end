import type { FormRules } from 'element-plus'

export const useAuthFormRules = () => {
  const { t } = useI18n()

  const emailRules: FormRules['email'] = [
    { required: true, message: () => t('auth.emailRequired'), trigger: 'blur' },
    {
      validator: (_rule, value: string, callback) => {
        if (!isValidEmail(value)) callback(new Error(t('auth.emailInvalid')))
        else callback()
      },
      trigger: 'blur',
    },
  ]

  const loginRules: FormRules = {
    email: emailRules,
    password: [
      { required: true, message: () => t('auth.passwordRequired'), trigger: 'blur' },
    ],
  }

  const registerRules: FormRules = {
    name: [
      { required: true, message: () => t('auth.nameRequired'), trigger: 'blur' },
    ],
    email: emailRules,
    password: [
      { required: true, message: () => t('auth.passwordRequired'), trigger: 'blur' },
      {
        validator: (_rule, value: string, callback) => {
          if (!isStrongPassword(value)) callback(new Error(t('auth.passwordWeak')))
          else callback()
        },
        trigger: 'blur',
      },
    ],
  }

  return { loginRules, registerRules }
}
